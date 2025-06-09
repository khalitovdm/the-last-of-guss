import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1749458791805 implements MigrationInterface {
    name = 'InitialMigration1749458791805';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "user_role_enum" AS ENUM('SURVIVOR', 'NIKITA', 'ADMIN');
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                "role" "user_role_enum" NOT NULL DEFAULT 'SURVIVOR',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            );
            CREATE TABLE "rounds" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying,
                "startsAt" TIMESTAMP NOT NULL,
                "endsAt" TIMESTAMP NOT NULL,
                "winnerId" integer,
                "createdById" integer NOT NULL,
                "totalScore" integer NOT NULL DEFAULT '0',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_568208a7063d41d4838f7c1013a" PRIMARY KEY ("id")
            );
            CREATE TABLE "player_scores" (
                "id" SERIAL NOT NULL,
                "userId" integer NOT NULL,
                "roundId" uuid NOT NULL,
                "score" integer NOT NULL DEFAULT '0',
                "tapCount" integer NOT NULL DEFAULT '0',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_1797c36d352739349886a87702f" PRIMARY KEY ("id")
            );
            ALTER TABLE "rounds" ADD CONSTRAINT "FK_a6e034a787c2c9a17a7a10f8454" FOREIGN KEY ("winnerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            ALTER TABLE "rounds" ADD CONSTRAINT "FK_b03f57a1b415a999c759020a552" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            ALTER TABLE "player_scores" ADD CONSTRAINT "FK_4263e843c2c7f0c6f7b4e72a4c1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
            ALTER TABLE "player_scores" ADD CONSTRAINT "FK_3dd29f25c9354988775494d49a3" FOREIGN KEY ("roundId") REFERENCES "rounds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "player_scores" DROP CONSTRAINT "FK_3dd29f25c9354988775494d49a3";
            ALTER TABLE "player_scores" DROP CONSTRAINT "FK_4263e843c2c7f0c6f7b4e72a4c1";
            ALTER TABLE "rounds" DROP CONSTRAINT "FK_b03f57a1b415a999c759020a552";
            ALTER TABLE "rounds" DROP CONSTRAINT "FK_a6e034a787c2c9a17a7a10f8454";
            DROP TABLE "player_scores";
            DROP TABLE "rounds";
            DROP TABLE "users";
            DROP TYPE "user_role_enum";
        `);
    }

}
