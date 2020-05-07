using Crocodile.DataBase;
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
using Serilog;

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
            services.AddControllersWithViews();
            ConfigureDB(services);
            
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

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
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