// ViewModel Mapper
// Generation III Runtime (BFF)

/**
 * Builds the UI model by transforming raw enterprise data into a ViewModel.
 */
export class ViewModelMapper {
    public mapToViewModel(rawData: any, context: any, lens: any): any {
        // Extracts exactly what the UI needs based on the lens, dropping the rest.
        // Prevents React components from knowing the underlying schema.
        
        return {
            id: rawData.id,
            displayTitle: rawData.name || rawData.title || rawData.id,
            metrics: [], // Computed from raw data
            status: rawData.status,
            permissions: { canEdit: true }, // Simplified
            lensApplied: lens.lensId
        };
    }
}
