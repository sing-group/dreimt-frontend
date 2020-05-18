import { DrugStatusPipe } from './drug-status.pipe';

describe('DrugStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new DrugStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
