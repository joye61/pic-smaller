export type Task = () => Promise<void>;

export class Queue {
  list: Array<Task> = [];
  running: number = 0;

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
    this.schedule();
  }

  /**
   * Execute tasks, filling slots as they become available
   */
  private schedule() {
    while (this.running < this.max && this.list.length > 0) {
      const task = this.list.shift()!;
      this.running++;
      task()
        .catch((error) => {
          console.error("[Queue] task failed:", error);
        })
        .finally(() => {
          this.running--;
          this.schedule();
        });
    }
  }
}