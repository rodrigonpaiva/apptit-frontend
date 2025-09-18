export type HaccpControl = {
  id: string;
  point: string;
  threshold: string;
  due: string;
};

export type HaccpAlertType = "nc" | "sensor";

export type HaccpAlert = {
  id: string;
  type: HaccpAlertType;
  title: string;
  description: string;
  time: string;
};

export type HaccpDashboardPayload = {
  compliance: number;
  openNonConformities: number;
  offlineSensors: number;
  upcomingControls: HaccpControl[];
  alerts: HaccpAlert[];
};

export type HaccpControlPoint = {
  id: string;
  label: string;
  threshold: string;
  min: number;
  max: number;
  unit: "°C" | "°F";
  mode: "manual" | "iot";
};

export type HaccpLogStatus = "ok" | "nc";

export type HaccpLogEntry = {
  id: string;
  pointId: string;
  pointLabel: string;
  value: number;
  unit: string;
  timestamp: string;
  operator: string;
  mode: "manual" | "iot";
  status: HaccpLogStatus;
};

export type CreateHaccpLogInput = {
  pointId: string;
  value: number;
  unit: string;
  note?: string;
  photo?: File | null;
  mode?: "manual" | "iot";
};

export type NcStatus = "todo" | "inProgress" | "review" | "closed";

export type NcBoardItem = {
  id: string;
  title: string;
  type: string;
  severity: "low" | "medium" | "high";
  cause: string;
  due: string;
  assignee: string;
  actionsCount: number;
  pointId: string;
  status: NcStatus;
};

export type CreateNcPayload = {
  pointId: string;
  description: string;
  severity: "low" | "medium" | "high";
  due: string;
  assignee: string;
};

export type AddCorrectiveActionPayload = {
  action: string;
  assignee: string;
  due: string;
  evidence?: File | null;
};

export type ControlPointSetting = {
  id: string;
  name: string;
  type: "cold_room" | "hot_hold" | "delivery";
  min: number;
  max: number;
  frequency: number;
};

export type UpsertControlPointInput = {
  id?: string;
  name: string;
  type: "cold_room" | "hot_hold" | "delivery";
  min: number;
  max: number;
  frequency: number;
};
