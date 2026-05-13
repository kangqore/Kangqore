import { BlueprintImporter } from '../src/kangqore-vis/content-mapping/BlueprintImporter';
import { EntityImporter } from '../src/kangqore-vis/entity-architecture/EntityImporter';
import { FaqBank } from '../src/kangqore-vis/ai-answerability/FaqBank';
import { DataSourceRegistry } from '../src/kangqore-vis/data-sources/DataSourceRegistry';
import { registerDataSources } from '../src/kangqore-vis/data-sources';

async function main() {
  console.log('⚡ KangqoreVis seed starting…');

  registerDataSources();
  await DataSourceRegistry.ensurePersistedRecords();
  console.log('   ✓ Data source records persisted');

  const blueprints = await BlueprintImporter.importSeed();
  console.log(`   ✓ Blueprints — created: ${blueprints.created}, updated: ${blueprints.updated}`);

  const entities = await EntityImporter.importSeed();
  console.log(`   ✓ Entities — entities: ${entities.entities}, hubs: ${entities.hubs}`);

  const faqs = await FaqBank.importFromKB();
  console.log(`   ✓ FAQs — created: ${faqs.created}`);

  console.log('⚡ KangqoreVis seed complete.');
}

main()
  .catch((err) => {
    console.error('kangqore-vis.seed.error', err);
    process.exit(1);
  })
  .finally(() => process.exit(0));
