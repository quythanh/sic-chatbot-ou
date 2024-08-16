import { createContext } from "react";
import * as model1 from "@/models/all";
import * as api from "@/utils/api";
// Tạo một context với giá trị mặc định
export const SessionContext = createContext({
  saveOldSessions: [] as model1.Session[],
  oldSessions: (value: model1.Session[]) => {}
});