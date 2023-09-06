enum AlertTypes {
  SUCCESS = "success",
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

interface Alert {
  id?: number;
  text: string;
  type: AlertTypes;
}

export { AlertTypes, Alert };
