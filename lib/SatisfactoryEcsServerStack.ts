import * as cdk from 'aws-cdk-lib';
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { BlockPublicAccess, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';

// import * as sqs from 'aws-cdk-lib/aws-sqs';
export class SatisfactoryEcsServerStack extends cdk.Stack {
  MAX_PLAYERS = 10;
  STEAM_BETA = false;
  APP_NAME = 'satisfactory-server';
  BUCKET_NAME = 'savegame-bucket'

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "SatisfactoryVpc");

    const cluster = new ecs.Cluster(this, "SatisfactoryCluster", {
      vpc: vpc
    }); 

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu:2048,
      memoryLimitMiB: 8192
    });

    taskDefinition.addContainer('SatisfactoryServer', {
      //image: ecs.ContainerImage.fromRegistry("wolveix/satisfactory-server:latest"),
      //image: ecs.ContainerImage.fromEcrRepository();
      //image: ecs.ContainerImage.fromDockerImageAsset() // look  into this
      image: ecs.ContainerImage.fromAsset('./app'),
      cpu: 2048,
      memoryLimitMiB: 8192,
      logging: new ecs.AwsLogDriver({
        logRetention: RetentionDays.THREE_DAYS,
        streamPrefix: this.APP_NAME,
        mode: ecs.AwsLogDriverMode.NON_BLOCKING,
      }),
      portMappings: [
        {
          protocol: ecs.Protocol.UDP,
          containerPort: 7777,
          hostPort: 7777,
        },
        {
          protocol: ecs.Protocol.TCP,
          containerPort: 7777,
          hostPort: 7777
        },
        {
          protocol: ecs.Protocol.TCP,
          containerPort: 8888,
          hostPort: 8888
        }
      ],
      environment: {
        ["MAXPLAYERS"]: `${this.MAX_PLAYERS}`,
        ["PGID"]: "1000",
        ["PUID"]: "1000",
        ["STEAMBETA"]: `${this.STEAM_BETA}`,
        ["APP_NAME"]: this.APP_NAME,
        ["BUCKET_NAME"]: this.BUCKET_NAME,
      },
    });

    const serviceSecurityGroup = new ec2.SecurityGroup(this, 'SatisfactorySG', {
      vpc: vpc,
      allowAllOutbound: true
    });

    serviceSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(7777)
    );

    serviceSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.udp(7777)
    );

    serviceSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(8888)
    );

    const service = new ecs.FargateService(this, 'SatisfactoryFargateService', {
      cluster: cluster,
      taskDefinition: taskDefinition,
      enableExecuteCommand: true,
      desiredCount: 1,
      assignPublicIp: true,
      securityGroups: [
        serviceSecurityGroup
      ],
    });

    const savegameBucket = new Bucket(this, this.BUCKET_NAME, {
      bucketName: `${this.APP_NAME}-${this.account}-${this.BUCKET_NAME}`,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    savegameBucket.grantReadWrite(taskDefinition.taskRole);
  }
}
