import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { AccountabilityService } from '../services/AccountabilityService';

const accountabilityService = new AccountabilityService();

export class CronManager {
  
  static initialize() {
    console.log('⏰ Initializing Cron Jobs...');
    this.scheduleNightlySnapshots();
    this.scheduleOverdueMonitor();
    this.scheduleImpactAccrual();
  }

  /**
   * Run nightly at 23:30 (Just before the midnight snapshot)
   * This ensures impacts are recorded in time for the daily snapshot.
   */
  private static scheduleImpactAccrual() {
      cron.schedule('30 23 * * *', async () => {
         try {
           await accountabilityService.processDailyImpactAccruals();
         } catch (err) {
           console.error('❌ Error in Impact Accrual:', err);
         }
      });
      console.log('   -> Impact Accrual scheduled (23:30 Daily)');
  }

  /**
   * Run hourly to check for overdue items
   */
  private static scheduleOverdueMonitor() {
    cron.schedule('0 * * * *', async () => {
       try {
         await accountabilityService.checkOverdueObligations();
       } catch (err) {
         console.error('❌ Error in Overdue Monitor:', err);
       }
    });
    console.log('   -> Overdue Monitor scheduled (Hourly)');
  }

  /**
   * Run nightly at 00:00 (Midnight)
   * Generates accountability snapshots for all active projects
   */
  private static scheduleNightlySnapshots() {
    cron.schedule('0 0 * * *', async () => {
      console.log('🌙 Starting Nightly Accountability Snapshot Job...');
      try {
        // Get all active projects
        const projects = await prisma.project.findMany({
          where: { status: 'ACTIVE' },
          select: { id: true, title: true, clientId: true }
        });

        console.log(`📋 Found ${projects.length} active projects for snapshot generation.`);

        for (const project of projects) {
          try {
            await accountabilityService.generateDailySnapshot(project.id, project.clientId);
            console.log(`✅ Snapshot generated for project: ${project.title}`);
          } catch (err) {
            console.error(`❌ Failed to generate snapshot for project ${project.title}:`, err);
          }
        }
        
        console.log('🌙 Nightly Accountability Snapshot Job Completed.');
      } catch (error) {
        console.error('❌ Critical error in Nightly Snapshot Job:', error);
      }
    });
    
    console.log('   -> Nightly Snapshot Job scheduled (00:00 Daily)');
  }
}
