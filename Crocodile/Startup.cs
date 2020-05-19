using System;
using System.IO;
using System.Reflection;
using Crocodile.DataBase.GameDB;
using Crocodile.DataBase.UserDB;
using Crocodile.DataBase.WordDB;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Serilog;
using Microsoft.OpenApi.Models;

namespace Crocodile
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                options.SerializerSettings.DefaultValueHandling = DefaultValueHandling.Populate;
            });
            BsonDefaults.GuidRepresentation = GuidRepresentation.Standard;
            ConfigureDB(services);
           
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Crocodile",
                    Description = "A game whose meaning is to explain a mysterious word by drawing some associations.",
                    //TermsOfService = new Uri("TODO"),
                    Contact = new OpenApiContact
                    {
                        Name = "(A)Boozers",
                        Email = string.Empty,
                        Url = new Uri("https://github.com/denrus99/project"),
                    },
                });

                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);
            });
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build"; });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseSerilogRequestLogging();

            app.UseRouting();
            // app.UseAuthentication();
            // app.UseAuthorization();
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Crocodile API");
            });
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                //endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }

        public void ConfigureDB(IServiceCollection services)
        {
            //Настройка конфигурации UserRepository из appsettings.json
            services.Configure<UsersDatabaseSettings>(
                Configuration.GetSection(nameof(UsersDatabaseSettings)));
            services.AddSingleton<IUsersDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<UsersDatabaseSettings>>().Value);
            //Подключение MongoUserRepository
            services.AddSingleton<MongoUserRepository>();

            //Настройка конфигурации GameRepository из appsettings.json 
            services.Configure<GamesDatabaseSettings>(
                Configuration.GetSection(nameof(GamesDatabaseSettings)));
            services.AddSingleton<IGamesDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<GamesDatabaseSettings>>().Value);
            //Подключение MongoGameRepository
            services.AddSingleton<MongoGameRepository>();

            //Настройка конфигурации WordRepository из appsettings.json 
            services.Configure<WordsDatabaseSettings>(
                Configuration.GetSection(nameof(WordsDatabaseSettings)));
            services.AddSingleton<IWordsDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<WordsDatabaseSettings>>().Value);
            //Подключение MongoWordRepository
            services.AddSingleton<MongoWordRepository>();
        }
    }
}