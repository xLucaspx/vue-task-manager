export default class Controller {
  private baseUrl: string = "http://localhost:3000";
  protected url: string;

  constructor(resource: string) {
    this.url = this.baseUrl + resource;
  }
}
