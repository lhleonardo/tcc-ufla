import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class CreateFinishedAppointmentColumn1632015690494 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.addColumn(
      'appointments',
      new TableColumn({ name: 'finished_date', type: 'timestamp', isNullable: true }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('appointments', 'finished_date');
  }
}
