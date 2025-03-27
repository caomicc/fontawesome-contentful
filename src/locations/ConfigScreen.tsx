import { useCallback, useState, useEffect } from 'react';
import { ConfigAppSDK } from '@contentful/app-sdk';
import {
  Heading,
  Form,
  FormControl,
  TextInput,
  Checkbox,
  Select,
  Stack,
  Flex,
  Subheading,
  Text
} from '@contentful/f36-components';
import { css } from 'emotion';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';

export interface AppInstallationParameters {
  allowedStyles?: ('solid' | 'regular' | 'light' | 'thin' | 'duotone' | 'brands')[];
  defaultStyle?: string;
  maxSuggestions?: number;
  minSearchChars?: number;
  searchInTerms?: boolean;
  searchInNames?: boolean;
  searchInValues?: boolean;
  iconSize?: number;
  placeholderText?: string;
  previewBackground?: string;
  previewBorder?: string;
}

const DEFAULT_PARAMETERS: AppInstallationParameters = {
  allowedStyles: ['solid', 'regular', 'light', 'thin', 'duotone', 'brands'],
  defaultStyle: 'solid',
  maxSuggestions: 5,
  minSearchChars: 2,
  searchInTerms: true,
  searchInNames: true,
  searchInValues: true,
  iconSize: 36,
  placeholderText: 'Search icons... (type at least 2 characters)',
  previewBackground: '#eee',
  previewBorder: '#E5E5E5'
};

const STYLE_OPTIONS = ['solid', 'regular', 'light', 'thin', 'duotone', 'brands'] as const;

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>(DEFAULT_PARAMETERS);
  const sdk = useSDK<ConfigAppSDK>();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();

      if (currentParameters) {
        setParameters({ ...DEFAULT_PARAMETERS, ...currentParameters });
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk]);

  return (
    <Flex flexDirection="row" className={css({ margin: '40px', maxWidth: '600px' })}>
      <Form>
        <Stack spacing="spacingXl" flexDirection="column">
          <Heading>Font Awesome Icon Picker Configuration</Heading>

          <Stack spacing="spacingL" flexDirection="column" textAlign="left">
            <Subheading>Icon Styles</Subheading>
            {STYLE_OPTIONS.map(style => (
              <FormControl key={style}>
                <Checkbox
                  id={`style-${style}`}
                  isChecked={parameters.allowedStyles?.includes(style)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setParameters(prev => ({
                      ...prev,
                      allowedStyles: checked
                        ? [...(prev.allowedStyles || []), style]
                        : (prev.allowedStyles || []).filter(s => s === style)
                    }));
                  }}
                >
                  Enable {style} icons
                </Checkbox>
              </FormControl>
            ))}

            <Subheading>Search Settings</Subheading>
            <FormControl>
              <FormControl.Label>Maximum suggestions to show</FormControl.Label>
              <TextInput
                type="number"
                value={parameters.maxSuggestions?.toString()}
                onChange={(e) => setParameters(prev => ({ ...prev, maxSuggestions: parseInt(e.target.value, 10) }))}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Minimum characters to trigger search</FormControl.Label>
              <TextInput
                type="number"
                value={parameters.minSearchChars?.toString()}
                onChange={(e) => setParameters(prev => ({ ...prev, minSearchChars: parseInt(e.target.value, 10) }))}
              />
            </FormControl>
            <FormControl>
              <Checkbox
                id="search-terms"
                isChecked={parameters.searchInTerms}
                onChange={(e) => setParameters(prev => ({ ...prev, searchInTerms: e.target.checked }))}
              >
                Search in icon terms
              </Checkbox>
            </FormControl>
            <FormControl>
              <Checkbox
                id="search-names"
                isChecked={parameters.searchInNames}
                onChange={(e) => setParameters(prev => ({ ...prev, searchInNames: e.target.checked }))}
              >
                Search in icon names
              </Checkbox>
            </FormControl>
            <FormControl>
              <Checkbox
                id="search-values"
                isChecked={parameters.searchInValues}
                onChange={(e) => setParameters(prev => ({ ...prev, searchInValues: e.target.checked }))}
              >
                Search in icon values
              </Checkbox>
            </FormControl>

            <Subheading>Appearance</Subheading>
            <FormControl>
              <FormControl.Label>Icon size (px)</FormControl.Label>
              <TextInput
                type="number"
                value={parameters.iconSize?.toString()}
                onChange={(e) => setParameters(prev => ({ ...prev, iconSize: parseInt(e.target.value, 10) }))}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Search placeholder text</FormControl.Label>
              <TextInput
                value={parameters.placeholderText}
                onChange={(e) => setParameters(prev => ({ ...prev, placeholderText: e.target.value }))}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Icon preview background color</FormControl.Label>
              <TextInput
                value={parameters.previewBackground}
                onChange={(e) => setParameters(prev => ({ ...prev, previewBackground: e.target.value }))}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>Icon preview border color</FormControl.Label>
              <TextInput
                value={parameters.previewBorder}
                onChange={(e) => setParameters(prev => ({ ...prev, previewBorder: e.target.value }))}
              />
            </FormControl>
          </Stack>
        </Stack>
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
