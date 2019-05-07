import { registerControls } from './customizer/setup/register-controls';
import { registerOuterSections } from './customizer/setup/register-outer-sections';
import { registerPanels } from './customizer/setup/register-panels';
import { registerSections } from './customizer/setup/register-sections';
import { registerSettings } from './customizer/setup/register-settings';

// Setup customizer functionality on the control side.
registerPanels();
registerSections();
registerOuterSections();
registerSettings();
registerControls();
