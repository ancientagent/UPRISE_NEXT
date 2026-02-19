import { z } from 'zod';

const positiveInt = z.number().int().positive();
const unitInterval = z.number().min(0).max(1);

export const UpdateFairPlayConfigSchema = z.object({
  recurrenceReorderHours: positiveInt.optional(),
  recurrenceRollingWindowDays: positiveInt.optional(),
  bandPersistDays: positiveInt.optional(),

  newWindowBandLowMaxActive: positiveInt.optional(),
  newWindowBandLowDays: positiveInt.optional(),
  newWindowBandMidMinActive: positiveInt.optional(),
  newWindowBandMidMaxActive: positiveInt.optional(),
  newWindowBandMidDays: positiveInt.optional(),
  newWindowBandHighMinActive: positiveInt.optional(),
  newWindowBandHighDays: positiveInt.optional(),

  graduationMinAgeDays: positiveInt.optional(),
  graduationExecutionCadenceDays: positiveInt.optional(),
  graduationCapPerRun: positiveInt.optional(),

  propagationMinUniqueListeners: positiveInt.optional(),
  propagationRateThreshold: unitInterval.optional(),
  propagationConfidenceGate: unitInterval.optional(),
});

export type UpdateFairPlayConfigDto = z.infer<typeof UpdateFairPlayConfigSchema>;
