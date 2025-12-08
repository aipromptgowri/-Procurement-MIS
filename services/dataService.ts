import { supabase } from './supabaseClient';
import { WeeklyData } from '../types';
import { CURRENT_WEEK_DATA } from '../constants';

// We will use ID 1 as the "current" report for simplicity in this version.
// In a full version, you might have a table with multiple weeks.
const REPORT_ID = 1;

export const fetchWeeklyData = async (): Promise<WeeklyData> => {
  try {
    const { data, error } = await supabase
      .from('weekly_reports')
      .select('report_data')
      .eq('id', REPORT_ID)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
      console.error('Error fetching data:', error);
      throw error;
    }

    if (data && data.report_data) {
      return data.report_data as WeeklyData;
    }

    // If no data exists in DB, return default local constant
    return CURRENT_WEEK_DATA;
  } catch (error) {
    console.error("Supabase connection failed, using local fallback", error);
    return CURRENT_WEEK_DATA;
  }
};

export const saveWeeklyData = async (data: WeeklyData): Promise<void> => {
  // We use upsert. If ID 1 exists, it updates. If not, it attempts to insert.
  // Note: Since 'id' is generated always as identity in the SQL instructions, 
  // we might need to handle the first insert carefully or just rely on the existing row if created.
  
  // Strategy: Check if it exists, if not insert, else update.
  const { data: existing } = await supabase.from('weekly_reports').select('id').eq('id', REPORT_ID).single();
  
  let error;
  
  if (existing) {
     const res = await supabase
      .from('weekly_reports')
      .update({ 
        report_data: data,
        updated_at: new Date().toISOString()
      })
      .eq('id', REPORT_ID);
      error = res.error;
  } else {
     // For the very first save, we might need to rely on the DB creating an ID, 
     // or force ID 1 if the column allows (depending on how table was created).
     // Since we defined `generated always as identity`, we usually insert without ID.
     // However, to keep this singleton pattern working for this specific UI:
     const res = await supabase
      .from('weekly_reports')
      .insert({ report_data: data }); // Let DB assign ID (likely 1 if empty)
      error = res.error;
  }

  if (error) {
    throw error;
  }
};