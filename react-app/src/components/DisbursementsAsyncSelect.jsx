import React from 'react';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash/debounce';
import axios from 'axios';
import toast from 'react-hot-toast';

function fetchData(inputValue, cb) {
  axios
    .post(reverseUrl('disbursements'), { search_value: inputValue })
    .then((res) => {
      let data = res.data.disbursements.map((item) => ({
        label: `${item.landlord_name} - ${item.reg_number} (Lease: ${item.lease_id} - $${item.amount})`,
        value: item.landlord_id,
        ...item,
      }));
      cb(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

const debFetch = debounce((inputValue, cb) => fetchData(inputValue, cb), 1000);

const promiseOptions = (inputValue) =>
  new Promise((resolve) => debFetch(inputValue, resolve));

export default function DisbursementsAsyncSelect({
  handleCreditorSelect,
  index,
}) {
  return (
    <AsyncSelect
      handleCreditorSelect={handleCreditorSelect}
      className="w-100"
      name="creditor"
      id="creditor"
      required
      defaultValue={null}
      isDisabled={false}
      // ______________________________
      cacheOptions
      defaultOptions
      maxMenuHeight={150}
      url={reverseUrl('disbursements')}
      onChange={(selectedOption) => handleCreditorSelect(selectedOption, index)}
      loadOptions={(inputValue) => promiseOptions(inputValue)}
    />
  );
}
