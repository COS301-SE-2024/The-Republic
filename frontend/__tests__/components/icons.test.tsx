import { describe, expect } from '@jest/globals';
import * as Icons from '@/components/icons';

describe('Icon exports', () => {
  it('should export HomeIcon', () => {
    expect(Icons.HomeIcon).toBeDefined();
  });

  it('should export ProfileIcon', () => {
    expect(Icons.ProfileIcon).toBeDefined();
  });

  it('should export VisualizationsIcon', () => {
    expect(Icons.VisualizationsIcon).toBeDefined();
  });

  it('should export LogoutIcon', () => {
    expect(Icons.LogoutIcon).toBeDefined();
  });

  it('should export ReportsIcon', () => {
    expect(Icons.ReportsIcon).toBeDefined();
  });

  it('should export NotificationsIcon', () => {
    expect(Icons.NotificationsIcon).toBeDefined();
  });

  it('should export SettingsIcon', () => {
    expect(Icons.SettingsIcon).toBeDefined();
  });
});
