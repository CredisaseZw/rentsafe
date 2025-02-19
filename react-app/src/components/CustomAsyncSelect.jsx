import axios from 'axios';
import debounce from 'lodash/debounce';
import AsyncSelect from 'react-select/async';
import { capitalize } from 'lodash';

async function fetchData(inputValue, url) {
  try {
    const response = await fetch(`${url}?query=${inputValue}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // console.log('data', data.result);
    // Return the full item data, not just label and value
    return data.result.map((item) => ({
      label: item.tenant + ' - ' + item.lease_id,
      value: item.lease_id,
      ...item, // Spread all other tenant fields here
    }));
  } catch (error) {
    console.error('Error fetching tenants:', error);
    return [];
  }
}

async function alternativeFetchData(
  inputValue,
  url = reverseUrl('search_individuals_or_companies'),
  useAlternateFetchOptions
) {
  if (!inputValue) {
    return [];
  }
  const opts = useAlternateFetchOptions;
  try {
    const res = await axios(url, {
      params: {
        q: inputValue,
        limit: opts.limit || 10,
        type: opts.type,
      },
    });

    const data = res.data.data;

    if (opts.type === 'individual') {
      return data.map((individual) => ({
        label: `${capitalize(individual.firstname)} ${capitalize(
          individual.surname
        )} - ${individual.national_id.toUpperCase()}`,
        value: individual.id,
        ...individual,
      }));
    } else {
      return data.map((company) => ({
        label: `${capitalize(
          company.registration_name
        )} - ${company.registration_number.toUpperCase()}`,
        value: company.id,
        ...company,
      }));
    }
  } catch (error) {
    console.error(`Error fetching tenants: ${error}`);
    return [];
  }
}

const debouncedFetchData = debounce(
  (inputValue, callback, url, useAlternateFetchOptions) => {
    if (useAlternateFetchOptions)
      alternativeFetchData(inputValue, url, useAlternateFetchOptions).then(
        callback
      );
    else fetchData(inputValue, url).then(callback);
  },
  1000
);

function promiseOptions(inputValue, url, useAlternateFetchOptions) {
  return new Promise((resolve) => {
    debouncedFetchData(inputValue, resolve, url, useAlternateFetchOptions);
  });
}

export default function CustomAsyncSelect({
  onChange,
  value,
  defaultValue,
  isDisabled,
  url,
  extraProps = {},
  useAlternateFetchOptions = undefined,
  noOptionsMessage = undefined,
}) {
  return (
    <>
      <AsyncSelect
        required={extraProps.required}
        cacheOptions
        defaultOptions
        loadOptions={(inputValue) => {
          return promiseOptions(inputValue, url, useAlternateFetchOptions);
        }}
        noOptionsMessage={noOptionsMessage}
        onChange={onChange} // Will return the full selected tenant data
        value={value}
        isDisabled={isDisabled}
        defaultValue={defaultValue}
        maxMenuHeight={150}
        {...extraProps}
      />
    </>
  );
}
