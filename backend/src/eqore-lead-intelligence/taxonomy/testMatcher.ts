import { ServiceMatcherService } from './serviceMatcher.service';

const testTranscripts = [
  "We need ServiceNow integration for our internal IT support workflows.",
  "I want to build an agentic ai workflow to automate lead qualification.",
  "I am interested in aws cloud migration and cost optimization.",
  "What is your price for SEO services?",
  "I am a student researching AI trends for my thesis.",
];

console.log("=== eQORE SERVICE MATCHER TEST SUITE ===\n");

testTranscripts.forEach((transcript, i) => {
  console.log(`Test ${i + 1}: "${transcript}"`);
  const result = ServiceMatcherService.matchServices(transcript);
  console.log(`- Primary Dept: ${result.primaryDepartment}`);
  console.log(`- Top Service: ${result.matchedServices[0]?.service || 'None'}`);
  console.log(`- Fit Score: ${result.matchedServices[0]?.fitScore || 0}%`);
  console.log(`- Package: ${result.recommendedSolutionPackage}`);
  console.log(`- Question: ${result.nextBestQuestion}`);
  console.log(`- Reason: ${result.serviceMatchReason}`);
  console.log("------------------------------------------\n");
});
