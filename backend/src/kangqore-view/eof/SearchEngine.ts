import { DecisionVariable, CandidateStrategy, OptimizationExecution } from './contracts/types';

export class SearchEngine {
  public generateCandidates(
    variables: DecisionVariable[],
    execution: OptimizationExecution
  ): CandidateStrategy[] {
    console.log(`[SearchEngine] Generating candidate strategies using ${execution.algorithm}`);

    if (execution.algorithm !== 'GRID_SEARCH') {
      throw new Error(`Algorithm ${execution.algorithm} not yet implemented.`);
    }

    // Grid search logic: find all combinations
    const permutations = this.cartesianProduct(variables);
    
    return permutations.map((perm, index) => ({
      strategyId: `STRAT_${Date.now()}_${index}`,
      variables: perm,
      generatedBy: execution.algorithm,
      searchIteration: 1
    }));
  }

  private cartesianProduct(variables: DecisionVariable[]): Record<string, any>[] {
    let result: Record<string, any>[] = [{}];
    
    for (const variable of variables) {
      const currentValues = this.getValuesForVariable(variable);
      const temp: Record<string, any>[] = [];
      
      for (const res of result) {
        for (const val of currentValues) {
          temp.push({ ...res, [variable.id]: val });
        }
      }
      result = temp;
    }
    
    return result;
  }

  private getValuesForVariable(variable: DecisionVariable): any[] {
    if (variable.allowedValues) return variable.allowedValues;
    if (variable.type === 'BOOLEAN') return [true, false];
    
    const vals = [];
    if (variable.min !== undefined && variable.max !== undefined && variable.step !== undefined) {
      for (let v = variable.min; v <= variable.max; v += variable.step) {
        vals.push(v);
      }
    }
    return vals;
  }
}
