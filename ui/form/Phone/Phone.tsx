import React, { KeyboardEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { getIn } from 'formik';
import FormError from '../../../FormError';
import { inputVariants } from '../../variants/input-variants';
import { cn } from '../../../utils/cn';
import BaseParagraph from '../../base-paragraph/BaseParagraph';

function Phone({
  size = 'md',
  color = 'default',
  shape = 'smooth',
  className: classes = '',
  icon,
  addon,
  loading,
  suffixStyle,
  inputStyle,
  inputClassName,
  selectCountry,
  placeholder,
  name,
  formik,
  onChange = () => {},
  style,
  label,
  value,
  labelClass,
  ...rest
}: {
  suffixStyle?: string;
  inputStyle?: string;
  inputClassName?: string;
  selectCountry?: boolean;
  placeholder?: string;
  name: string;
  formik: any;
  onChange?: (value: string) => void;
  style?: any;
  label?: string;
  value?: string;
  labelClass?: string;
}) {
  const {
    countries = [
      {
        code: '+1',
        name: 'USA',
        dialCode: '+1',
        flag: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg'
      }
    ]
  } = rest || {};

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: '+1',
    name: 'USA',
    dialCode: '+1',
    flag: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg'
  });

  const [countryCode, setCountryCode] = useState('+1'); // Default country code
  const [phoneNumberDisplay, setPhoneNumberDisplay] = useState(''); // formatted number for display
  const [phoneNumberRaw, setPhoneNumberRaw] = useState(''); // raw number to be sent to Formik
  const [isDeleting, setIsDeleting] = useState(false); // track if deleting

  let error = getIn(formik?.touched, name) && getIn(formik.errors, name);

  useEffect(() => {
    if (value) {
      const unformattedNumber = value?.replace(/[^\d]/g, '').slice(1); // Remove +1
      const formattedNumber = handlePhoneNumberChange2(unformattedNumber);
      setPhoneNumberDisplay(formattedNumber);
      setPhoneNumberRaw(value); // +1 number
    }
  }, [value]);

  const handlePhoneNumberChange2 = (value = '') => {
    let number = String(value).replace(/[^\d]/g, '');

    const formattedParts = [];
    const part1 = number.slice(0, 3);
    const part2 = number.slice(3, 6);
    const part3 = number.slice(6, 10);

    if (part1) formattedParts.push(`(${part1}) `);
    if (part2) formattedParts.push(`${part2}-`);
    if (part3) formattedParts.push(part3);

    return formattedParts.join('');
  };

  const handlePhoneNumberChange = (e: { target: { value: string } }) => {
    let inputVal = e.target.value?.replace(/[^\d]/g, ''); // Only digits
    if (inputVal.length > 10) inputVal = inputVal.slice(0, 10);

    // Set display value
    setPhoneNumberDisplay(handlePhoneNumberChange2(inputVal));

    // Set raw value (+16666666666) and send to Formik
    const rawPhone = countryCode + inputVal;
    setPhoneNumberRaw(rawPhone);
    formik?.setFieldValue(name, rawPhone); // send raw phone number to Formik
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault(); // Prevent the default backspace behavior
      const input = event.target as HTMLInputElement;
      const { selectionStart, selectionEnd } = input;

      if (selectionStart === null || selectionEnd === null) return;

      let newText = phoneNumberDisplay;

      if (selectionStart !== selectionEnd) {
        // Delete selected text
        newText =
          phoneNumberDisplay.slice(0, selectionStart) + phoneNumberDisplay.slice(selectionEnd);
      } else if (selectionStart > 0) {
        const prevChar = phoneNumberDisplay[selectionStart - 1];

        if (prevChar === '-') {
          // If backspace is on a formatting character, delete it along with the previous number
          newText =
            phoneNumberDisplay.slice(0, selectionStart - 2) +
            phoneNumberDisplay.slice(selectionStart);
        } else if (prevChar === ' ') {
          // Delete preceding number inside parentheses
          const trimmedNumber = phoneNumberDisplay.trim();
          newText =
            trimmedNumber.slice(1, selectionStart - 3) + trimmedNumber.slice(selectionStart - 1);
        } else if (prevChar === ')') {
          // If backspace is on the closing parenthesis, delete the parenthesis and the previous number
          newText =
            phoneNumberDisplay.slice(0, selectionStart - 5) +
            phoneNumberDisplay.slice(selectionStart);
        } else {
          // Delete only the preceding character (number)
          newText =
            phoneNumberDisplay.slice(0, selectionStart - 1) +
            phoneNumberDisplay.slice(selectionStart);
        }
      }

      // After updating newText, reformat it to maintain proper phone number format
      const rawNumber = newText.replace(/[^\d]/g, ''); // Remove all non-numeric characters
      const formattedNumber = handlePhoneNumberChange2(rawNumber); // Reformat the number

      setPhoneNumberDisplay(formattedNumber);

      // Set raw value (+16666666666) and send to Formik
      const rawPhone = countryCode + rawNumber;
      setPhoneNumberRaw(rawPhone);
      if (formik) {
        formik?.setFieldValue(name, rawPhone);
      }
    }
  };

  return (
    <label htmlFor={name}>
      {label && (
        <label
          htmlFor={name}
          className="font-sans text-[.85rem] text-muted-400 dark:text-muted-300"
        >
          {label}
        </label>
      )}
      <div
        // className="relative flex items-center gap-2 overflow-hidden rounded-lg border border-muted-200 bg-white px-4 py-2 text-muted-600 placeholder:text-muted-300"
        className={cn(
          inputVariants({
            size,
            color,
            shape,
            className: `peer ${classes} ${size === 'sm' && icon ? 'pe-2 ps-8' : ''} ${size === 'md' && icon ? 'pe-3 ps-10' : ''} ${size === 'lg' && icon ? 'pe-4 ps-12' : ''} ${size === 'sm' && !icon ? 'px-2' : ''} ${size === 'md' && !icon ? 'px-3' : ''} ${size === 'lg' && !icon ? 'px-4' : ''} ${error ? '!border-error-500' : ''} ${addon ? '!rounded-s-none' : ''} ${
              loading
                ? 'pointer-events-none !select-none !text-muted-400 !shadow-none placeholder:!text-transparent'
                : ''
            } `
          }),
          'flex items-center gap-2 overflow-hidden rounded-lg border border-muted-200 bg-white px-4 py-2 text-muted-600 placeholder:text-muted-300'
        )}
      >
        <div
          className="flex cursor-pointer items-center space-x-2 leading-5"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <Image
            src={selectedCountry.flag}
            alt={`${selectedCountry.code} Flag`}
            className="h-3 w-6"
            width={24}
            height={24}
          />
          <BaseParagraph color="muted">{selectedCountry.code}</BaseParagraph>
        </div>
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          className="ml-2 h-full w-full border-none bg-transparent text-sm focus:outline-none"
          {...rest}
          onChange={handlePhoneNumberChange}
          onKeyDown={handleKeyDown} // Listen for backspace key
          value={phoneNumberDisplay}
        />
      </div>

      {formik && (
        <div className="mt-0.5">
          <FormError formik={formik} name={name} helperText={''} />
        </div>
      )}
    </label>
  );
}

export default Phone;

// import React, { ClipboardEvent, KeyboardEvent, useEffect, useState } from 'react';
// import { cn } from '../../../utils/cn';
// import { inputVariant } from './utils/inputVariant';
// import Image from 'next/image';
// import { getIn } from 'formik';

// type PhonePropsType = {
//   suffixStyle?: React.CSSProperties;
//   inputStyle?: React.CSSProperties;
//   inputClassName?: string;
//   selectCountry?: boolean;
//   formik?: {
//     setFieldValue: (name: string, value: string) => void;
//     errors: { [key: string]: string };
//     touched: { [key: string]: string };
//     [key: string]: any;
//   };
//   onChange?: () => void | undefined;
//   name: string;
//   style?: React.CSSProperties;
//   tagName?: string;
//   children?: React.ReactNode;
//   id?: string;
//   type?: string;
//   className?: string;
//   placeholder?: string;
//   countries?: Array<{
//     code: string;
//     name: string;
//     dialCode: string;
//     flag: string;
//   }>;
//   value?: string;
//   variant?: 'XL' | 'L' | 'M' | 'S' | undefined;
//   label?: string;
//   labelClass?: string;
// };

// function Phone({
//   suffixStyle,
//   inputStyle,
//   inputClassName,
//   selectCountry,
//   placeholder,
//   name,
//   formik,
//   onChange = () => {},
//   style,
//   label,
//   value,
//   labelClass,
//   ...rest
// }: PhonePropsType) {
//   const {
//     countries = [
//       {
//         code: '+1',
//         name: 'USA',
//         dialCode: '+1',
//         flag: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg'
//       }
//     ]
//   } = rest || {};

//   // set default value to empty string
//   useEffect(() => {
//     if (formik?.isSubmitting) {
//       setPhoneNumber('');
//     }
//   }, [formik]);
//   useEffect(() => {
//     setPhoneNumber('');
//   }, []);

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [selectedCountry, setSelectedCountry] = useState({
//     code: '+1',
//     name: 'USA',
//     dialCode: '+1',
//     flag: 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg'
//   });

//   console.log('value of number', getIn(formik?.values, name));
//   const [countryCode, setCountryCode] = useState('+1'); // Default country code
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [isValid, setIsValid] = useState(false);
//   const [isFocused, setIsFocused] = useState(false);

//   const handleCountryCodeChange = (e: { target: { value: React.SetStateAction<string> } }) => {
//     setCountryCode(e.target.value);
//   };

//   const handlePhoneNumberChange2 = (value: string = '') => {
//     // Ensure value is a string
//     let number = String(value);

//     // Remove non-numeric characters except dot (.)
//     number = number.replace(/[^\d]/g, '');

//     const formattedParts = [];

//     const part1 = number.slice(0, 3);
//     const part2 = number.slice(3, 6);
//     const part3 = number.slice(6, 10);

//     if (part1) {
//       formattedParts.push(`${part1.length === 3 ? `(${part1})` : `${part1}`} `);
//     }
//     if (part2) {
//       formattedParts.push(`${part2}${part2.length === 3 ? '-' : ''}`);
//     }
//     if (part3) {
//       formattedParts.push(part3);
//     }
//     // Filter out empty parts and join them with hyphens
//     return formattedParts.join('');
//   };

//   // Handle phone number input change
//   const handlePhoneNumberChange = (e: { target: { value: any } }) => {
//     let value = e.target.value;
//     // Limit input length to 13 digits

//     if (value.length > 14) {
//       value = value.slice(0, 14);
//     }

//     // Format the phone number input
//     const value2 = handlePhoneNumberChange2(value);

//     // Validate the phone number input using regex
//     const isValidPhoneNumber = /^\(\d{3}\) \d{3}-\d{4}$/.test(value); // Validates at least 10 digits
//     setIsValid(isValidPhoneNumber);
//     const number = formatPhoneNumber(value2, countryCode);

//     setPhoneNumber(number);

//     // console.log('number', number?.length);
//     // Update the formik field value if formik is provided
//     if (number.length > 13) {
//       // Format the phone number before submitting
//       const formattedPhoneNumber = formatPhoneNumber(number, countryCode);

//       // Pass the formatted phone number to the parent component if it's valid
//       if (isValid && isValidPhoneNumber && formik?.setFieldValue) {
//         if (selectCountry) {
//           const countryValue = countryCode + formattedPhoneNumber;
//           formik.setFieldValue(name || '', countryValue.replace(/[()\s-]/g, '')); // Provide a default value of an empty string for the name parameter
//         } else {
//           formik.setFieldValue(name || '', formattedPhoneNumber); // Provide a default value of an empty string for the name parameter
//         }
//       }
//     } else {
//       setIsValid(false);
//     }
//   };

//   // Format phone number based on country code
//   const formatPhoneNumber = (phoneNumber: string, countryCode: string) => {
//     if (countryCode === '+1') {
//       return phoneNumber.replace(/^\(\d{3}\) \d{3}-\d{4}$/, phoneNumber);
//     } else if (countryCode === '+880') {
//       return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
//     } else {
//       // Default formatting
//       return phoneNumber;
//     }
//   };

//   // Handle backspace key press
// const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
//   if (event.key === 'Backspace') {
//     event.preventDefault();
//     setIsValid(false);
//     const input = event.target as HTMLInputElement;

//     const { selectionStart, selectionEnd } = input;

//     if (selectionStart === null || selectionEnd === null) return;

//     if (selectionStart !== selectionEnd) {
//       // Delete selected text
//       const newText = phoneNumber.slice(0, selectionStart) + phoneNumber.slice(selectionEnd);
//       setPhoneNumber(newText);
//     } else if (selectionStart > 0) {
//       const prevChar = phoneNumber[selectionStart - 1];

//       if (prevChar === '-') {
//         // Delete preceding number and hyphen
//         const newText =
//           phoneNumber.slice(0, selectionStart - 2) + phoneNumber.slice(selectionStart);
//         setPhoneNumber(newText);
//       }
// else if (prevChar === ' ') {
//         // Delete preceding number inside parentheses
//         const trimmedNumber = phoneNumber.trim();
//         const newText =
//           trimmedNumber.slice(1, selectionStart - 3) + trimmedNumber.slice(selectionStart - 1);
//         setPhoneNumber(newText);
//       } else {
//         // Delete only the preceding character (number)
//         const newText =
//           phoneNumber.slice(0, selectionStart - 1) + phoneNumber.slice(selectionStart);
//         setPhoneNumber(newText);
//       }
//     }
//   }
// };

//   // Handle phone number paste
//   const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
//     event.preventDefault();
//     let pasteData = event.clipboardData.getData('Text');

//     // Check if the length of the data is 12 characters (including +)
//     if (pasteData.length !== 12 || !pasteData.startsWith('+')) {
//       return;
//     }
//     // Remove all characters except digits and +
//     pasteData = pasteData.replace(/[^0-9+]/g, '');

//     // Ensure only one + and it is at the front
//     if (pasteData.includes('+')) {
//       pasteData = pasteData.replace(/\+/g, ''); // Remove all +
//       pasteData = '+' + pasteData; // Add single + at the start
//     }

//     if (pasteData.startsWith('+1')) {
//       pasteData = pasteData.slice(2);
//     }
//     const input = event.target as HTMLInputElement;

//     const { selectionStart, selectionEnd } = input;

//     if (selectionStart === null || selectionEnd === null) return;
//     const newText =
//       phoneNumber.slice(0, selectionStart) + pasteData + phoneNumber.slice(selectionEnd);
//     setPhoneNumber(newText.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'));
//     setIsValid(true);
//   };

//   useEffect(() => {
//     if (formik && formik.errors?.[name]) {
//       setIsFocused(false);
//     }
//   }, [formik, formik?.errors, name]);

//   // update number field when value is changed
//   // useEffect(() => {
//   //   setIsValid(false);
//   //   const splittedPhoneNumber = value?.split('+1')?.[1];
//   //   if (splittedPhoneNumber) {
//   //     setPhoneNumber(splittedPhoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3'));
//   //   }
//   // }, [value]);
//   return (
//     <label htmlFor={name}>
//       {label && <span className={`text-sm ${labelClass}`}>{label}</span>}
//       <div
//         className={
//           inputVariant(rest?.variant || 'XL') &&
//           cn(
//             `relative flex items-center gap-2 overflow-hidden rounded-lg`,
//             'border border-muted-200 bg-white px-4 py-2 text-muted-600 placeholder:text-muted-300 focus-visible:border-muted-300 focus-visible:shadow-lg focus-visible:shadow-muted-300/30 focus-visible:outline-none hover:enabled:border-muted-300 dark:border-muted-700 dark:bg-muted-800 dark:text-muted-300 dark:placeholder:text-muted-600 dark:focus-visible:shadow-muted-800/20 dark:hover:enabled:border-muted-600',
//             {
//               '!border-error':
//                 (!isValid && phoneNumber) ||
//                 (formik?.errors?.[name] && formik?.touched?.[name]) ||
//                 (formik?.touched?.[name] && !phoneNumber),
//               '!border-success': (isValid && !formik?.errors?.[name]) || (isFocused && !phoneNumber)
//             },
//             inputVariant(rest?.variant || 'M')
//           )
//         }
//       >
//         <div
//           className="flex cursor-pointer items-center space-x-2 leading-5"
//           onClick={() => setDropdownOpen(!dropdownOpen)}
//         >
//           <Image
//             src={selectedCountry.flag}
//             alt={`${selectedCountry.code} Flag`}
//             className="h-3 w-6"
//             width={24}
//             height={24}
//           />
//           <span>{selectedCountry.code}</span>
//           <svg
//             className="h-3 w-4"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M19 9l-7 7-7-7"
//             ></path>
//           </svg>
//         </div>
//         <div
//           className={cn('mx-2 h-3 w-px bg-gray-300', {
//             'bg-error':
//               (!isValid && phoneNumber) || (formik?.errors?.[name] && formik?.touched?.[name]),
//             'bg-success': (isValid && !formik?.errors?.[name]) || (isFocused && !phoneNumber)
//           })}
//         />
//         <input
//           type="tel"
//           name={name}
//           placeholder={placeholder}
//           className={cn(
//             'h-ful w-full border-none bg-transparent text-sm focus:outline-none focus:ring-0'
//           )}
//           onKeyDown={handleKeyDown}
//           onChange={handlePhoneNumberChange}
//           onPaste={handlePaste}
//           onFocus={() => setIsFocused(true)}
//           value={phoneNumber}
//           autoComplete="new-password"
//           {...rest}
//         />
//         {dropdownOpen && (
//           <div className="absolute left-0 right-0 top-full mt-1 h-12 w-full overflow-hidden rounded-lg border border-gray-300 bg-white">
//             {countries.map((country) => (
//               <div
//                 key={country.code}
//                 className={cn(
//                   `flex cursor-pointer items-center justify-between overflow-hidden p-2 hover:bg-gray-100`,
//                   country.code === selectedCountry.code && 'bg-gray-100'
//                 )}
//                 onClick={(e) => {
//                   setSelectedCountry(country);
//                   //   setCountryCode(e.target?.value);
//                   setCountryCode(country.code);
//                   setDropdownOpen(false);
//                 }}
//               >
//                 <div className="flex h-3 items-center space-x-2">
//                   <div className="relative h-3 w-6">
//                     <Image src={country.flag} alt={`${country.code} Flag`} fill />
//                   </div>
//                   <span>{country.code}</span>
//                   <span>{country.name}</span>
//                 </div>
//                 <span>{country.dialCode}</span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {formik?.touched?.[name] && formik?.errors?.[name] ? (
//         <p className="text-xs text-error">{formik?.errors?.[name]}</p>
//       ) : null}
//     </label>
//     // </HtmlEl>
//   );
// }

// export default Phone;
