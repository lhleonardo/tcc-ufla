/**
 *
 * Centralização dos providers e instâncias que estão presentes na injeção
 * de dependências com o tsyringe
 */

/**
 * Registra todos os providers genéricos da aplicação, presentes na pasta
 * `@shared/container/providers`
 */
import './providers';

/**
 * Registra todos os providers específicos de cada módulo da aplicação,
 * presentes separadamente em cada uma das pastas de módulos, em
 *
 * `@modules/--module_name--/providers`
 */
import '@modules/users/providers';
import '@modules/appointments/providers';
import '@modules/notifications/providers';
