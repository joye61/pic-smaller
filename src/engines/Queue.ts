export type Task = () => Promise<void>;

export class Queue {
  // Current task list
  list: Array<Task> = [];
  // Indicate whether task queue running
  isRunning: boolean = false;

  /**
   *
   * @param max  Maximun concurrent task number
   */
  constructor(private max: number = 1) {}

  /**
   * Add new task for executing
   * @param task
   */
  public push(task: Task) {
    this.list.push(task);
    if (!this.isRunning) {
      this.do();
    }
  }

  /**
   * Execute a batch of tasks
   * @returns
   */
  private async do() {
    // If list is empty, end run
    if (this.list.length === 0) {
      this.isRunning = false;
      return;
    }

    this.isRunning = true;
    const takeList: Array<Task> = [];
    for (let i = 0; i < this.max; i++) {
      const task = this.list.shift();
      if (task) {
        takeList.push(task);
      }
    }

    // Execute all task
    const runningList = takeList.map((task) => task());
    await Promise.all(runningList);

    // Execute next batch
    await this.do();
  }
}
