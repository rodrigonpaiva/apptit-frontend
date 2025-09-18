"use client";

import { useEffect, useMemo, useState } from "react";
import {
  haccpDashboardMock,
  haccpControlPointsMock,
  haccpLogEntriesMock,
  haccpNcBoardMock,
  controlPointSettingsMock,
} from "./mocks/haccp";
import type {
  HaccpDashboardPayload,
  HaccpControlPoint,
  HaccpLogEntry,
  NcBoardItem,
  UpsertControlPointInput,
  CreateHaccpLogInput,
  CreateNcPayload,
  AddCorrectiveActionPayload,
  ControlPointSetting,
} from "./types";

export function useHaccpDashboardQuery(_siteId?: string) {
  const data = useMemo<HaccpDashboardPayload>(() => haccpDashboardMock, []);
  return { data, fetching: false, error: null };
}

export function useControlPointsQuery(_siteId?: string) {
  const data = useMemo<HaccpControlPoint[]>(() => haccpControlPointsMock, []);
  return { data, fetching: false, error: null };
}

export function useControlPointSettingsQuery(siteId?: string) {
  const [data, setData] = useState<ControlPointSetting[]>(controlPointSettingsMock);

  useEffect(() => {
    setData(controlPointSettingsMock);
  }, [siteId]);

  const refetch = () => setData([...controlPointSettingsMock]);

  return { data, fetching: false, error: null, refetch };
}

export function useUpsertControlPointMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (input: UpsertControlPointInput) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (input.id) {
        const index = controlPointSettingsMock.findIndex((item) => item.id === input.id);
        if (index >= 0) {
          controlPointSettingsMock[index] = { id: input.id, ...input };
        }
      } else {
        const id = `cp-${Date.now()}`;
        controlPointSettingsMock.push({ id, ...input });
      }
      return { success: true } as const;
    } catch (err) {
      const casted = err instanceof Error ? err : new Error("Unable to save control point");
      setError(casted);
      throw casted;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useDeleteControlPointMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const index = controlPointSettingsMock.findIndex((item) => item.id === id);
      if (index >= 0) {
        controlPointSettingsMock.splice(index, 1);
      }
      return { success: true } as const;
    } catch (err) {
      const casted = err instanceof Error ? err : new Error("Unable to delete control point");
      setError(casted);
      throw casted;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useHaccpLogsQuery(_siteId?: string) {
  const data = useMemo<HaccpLogEntry[]>(() => haccpLogEntriesMock, []);
  return { data, fetching: false, error: null };
}

export function useCreateHaccpLogMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (input: CreateHaccpLogInput) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return {
        success: true,
        log: {
          id: `log-${Date.now()}`,
          pointId: input.pointId,
          pointLabel: haccpControlPointsMock.find((p) => p.id === input.pointId)?.label ?? "",
          value: input.value,
          unit: input.unit,
          timestamp: new Date().toISOString(),
          operator: "You",
          mode: input.mode ?? "manual",
          status: input.value >= (haccpControlPointsMock.find((p) => p.id === input.pointId)?.min ?? 0)
            && input.value <= (haccpControlPointsMock.find((p) => p.id === input.pointId)?.max ?? 0)
            ? "ok"
            : "nc",
        } satisfies HaccpLogEntry,
      } as const;
    } catch (err) {
      const casted = err instanceof Error ? err : new Error("Unable to record measurement");
      setError(casted);
      throw casted;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useNcBoardQuery(_siteId?: string) {
  const data = useMemo<NcBoardItem[]>(() => haccpNcBoardMock, []);
  return { data, fetching: false, error: null };
}

export function useOpenNcMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (payload: CreateNcPayload) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { success: true, nc: payload } as const;
    } catch (err) {
      const casted = err instanceof Error ? err : new Error("Unable to open NC");
      setError(casted);
      throw casted;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useAddCorrectiveActionMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (ncId: string, action: AddCorrectiveActionPayload) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { success: true, ncId, action } as const;
    } catch (err) {
      const casted = err instanceof Error ? err : new Error("Unable to add corrective action");
      setError(casted);
      throw casted;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useCloseNcMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (ncId: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { success: true, ncId } as const;
    } catch (err) {
      const casted = err instanceof Error ? err : new Error("Unable to close NC");
      setError(casted);
      throw casted;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
