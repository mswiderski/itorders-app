package org.kie.server.swarm.bpm;


import java.io.File;
import java.util.HashSet;
import java.util.Set;

import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.kie.server.api.KieServerConstants;
import org.kie.server.api.model.KieContainerResource;
import org.kie.server.api.model.KieContainerStatus;
import org.kie.server.api.model.ReleaseId;
import org.kie.server.services.impl.storage.KieServerState;
import org.kie.server.services.impl.storage.file.KieServerStateFileRepository;
import org.wildfly.swarm.Swarm;
import org.wildfly.swarm.config.security.Flag;
import org.wildfly.swarm.config.security.SecurityDomain;
import org.wildfly.swarm.config.security.security_domain.ClassicAuthentication;
import org.wildfly.swarm.config.security.security_domain.authentication.LoginModule;
import org.wildfly.swarm.datasources.DatasourcesFraction;
import org.wildfly.swarm.jaxrs.JAXRSArchive;
import org.wildfly.swarm.security.SecurityFraction;
import org.wildfly.swarm.transactions.TransactionsFraction;

public class KieServerMain {
    
    private static String configFolder = System.getProperty("org.kie.server.swarm.conf", "src/main/config");
    private static String SERVER_ID = "itorders";
    
    private static String GROUP_ID = "org.jbpm.demo.apps";
    private static String ARTIFACT_ID = "itorders";
    private static String VERSION = "1.0.0";

    protected static void installKJars() {
                        
        String controller = System.getProperty(KieServerConstants.KIE_SERVER_CONTROLLER);
        
        if ( controller != null) {
            System.out.println("Controller is configured ("+controller+") - no local kjars can be installed");
            return;
        }
        
        // proceed only when kie server id is given and there is no controller
        
        KieServerStateFileRepository repository = new KieServerStateFileRepository();
        KieServerState currentState = repository.load(SERVER_ID);
        
        Set<KieContainerResource> containers = new HashSet<KieContainerResource>();
        

        ReleaseId releaseId = new ReleaseId(GROUP_ID, ARTIFACT_ID, VERSION);                     
        KieContainerResource container = new KieContainerResource(releaseId.getArtifactId()+"-"+releaseId.getVersion(), releaseId, KieContainerStatus.STARTED);
        containers.add(container);        
        
        currentState.setContainers(containers);
        
        repository.store(SERVER_ID, currentState);
       
    }
    
    protected static JAXRSArchive createDeployment(Swarm container) throws Exception {
        System.out.println("\tConfiguration folder is " + configFolder);
        
        LoginModule<?> loginModule = new LoginModule<>("UsersRoles");
        loginModule.flag(Flag.REQUIRED)
        .code("UsersRoles")
        .moduleOption("usersProperties", configFolder + "/security/application-users.properties")
        .moduleOption("rolesProperties", configFolder + "/security/application-roles.properties");
        
        SecurityDomain<?> security = new SecurityDomain<>("other")
                .classicAuthentication(new ClassicAuthentication<>()
                        .loginModule(loginModule)); 
        container.fraction(new SecurityFraction().securityDomain(security));

        JAXRSArchive deployment = ShrinkWrap.create(JAXRSArchive.class, "it-orders-web.war");
        deployment.staticContent();
        deployment.addAllDependencies();
        
        deployment.addAsWebInfResource(new File(configFolder + "/web/web.xml"), "web.xml");
        deployment.addAsWebInfResource(new File(configFolder + "/web/jboss-web.xml"), "jboss-web.xml");
        
                
        return deployment;
        
    }
    
    public static void main(String[] args) throws Exception {
        System.setProperty(KieServerConstants.KIE_SERVER_ID, SERVER_ID);
        Swarm container = new Swarm();
        // Configure the Datasources subsystem with a driver and a datasource
        String driverModule = "com.h2database.h2";
        container.fraction(new DatasourcesFraction()
                        .jdbcDriver("h2", (d) -> {
                            d.driverClassName("org.h2.Driver");
                            d.xaDatasourceClass("org.h2.jdbcx.JdbcDataSource");
                            d.driverModuleName("com.h2database.h2");
                        })
                        .dataSource("ExampleDS", (ds) -> {
                            ds.driverName("h2");
                            ds.connectionUrl("jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE");
                            ds.userName("sa");
                            ds.password("sa");
                        })                        
        );
        
        // uncomment to use postgres instead of h2
//        driverModule = "org.postgresql";
//        container.fraction(new DatasourcesFraction()
//                .jdbcDriver("org.postgresql", (d) -> {
//                    d.driverClassName("org.postgresql.Driver");
//                    d.xaDatasourceClass("org.postgresql.xa.PGXADataSource");
//                    d.driverModuleName("org.postgresql");
//                })
//                .dataSource("ExampleDS", (ds) -> {
//                    ds.driverName("org.postgresql");
//                    ds.connectionUrl("jdbc:postgresql://localhost:5432/jbpm");
//                    ds.userName("jbpm");
//                    ds.password("jbpm");
//                })                        
//                );
        // configure transactions
        container.fraction(TransactionsFraction.createDefaultFraction());        
       
        System.out.println("\tBuilding kie server deployable...");
        JAXRSArchive deployment = createDeployment(container);  
        deployment.addModule(driverModule);
        
        System.out.println("\tStarting Wildfly Swarm....");
        container.start();   
        
        System.out.println("\tConfiguring kjars...");
        installKJars();
        
        System.out.println("\tDeploying application ....");
        container.deploy(deployment);
        System.out.println("\tSUCCESS :: IT Orders application ready!!!");
    }
}
