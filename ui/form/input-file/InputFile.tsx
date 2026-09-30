'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { ReIcon } from '../../../components/ReIcon/ReIcon';
import Progress from '../../progress/Progress';
import { useDropzone } from 'react-dropzone';
import IconBox from '../../iconbox/IconBox';
import Button from '../../button/Button';
import Loader from '../../loader/Loader';

// Define the props interface for the InputFile component
export interface InputFileProps {
  id: string;
  url: string;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  maxUploads?: number;
  allowMultiple?: boolean;
  label?: string;
  labelAlt?: string;
  shape?: 'straight' | 'rounded' | 'smooth' | 'curved' | 'full';
  color?:
    | 'default'
    | 'contrast'
    | 'muted'
    | 'mutedContrast'
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'none';
  bordered?: boolean;
  spaced?: boolean;
  responses?: any;
  setResponses?: any;
}

// Define the interface for file status
export interface FileStatus {
  name: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  message?: string;
}

export default function InputFile(props: InputFileProps) {
  // Destructure props with default values
  const {
    id,
    url,
    acceptedFileTypes,
    maxFileSize = 5,
    maxUploads = 5,
    allowMultiple = false,
    label = '',
    labelAlt = '',
    shape = 'smooth',
    color = 'contrast',
    bordered = false,
    spaced = true,
    responses,
    setResponses
  } = props;

  const [files, setFiles] = useState<FileStatus[]>([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [oversizedFiles, setOversizedFiles] = useState<string[]>([]);
  const [maxUploadExceeded, setMaxUploadExceeded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Callback function to handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Check if the maximum number of file uploads has been exceeded
      if (files.length + acceptedFiles.length > maxUploads) {
        setMaxUploadExceeded(true);
        return;
      } else {
        setMaxUploadExceeded(false);
      }

      const newFiles = acceptedFiles.map((file) => ({
        name: file.name,
        progress: 0,
        status: 'uploading' as const
      }));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      acceptedFiles.forEach(uploadFile);

      // Handle oversized files
      const oversized = rejectedFiles
        .filter((file) => file.errors[0]?.code === 'file-too-large')
        .map((file) => file.file.name);
      setOversizedFiles(oversized);
    },
    [files, maxUploads]
  );

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes
      ? acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {})
      : undefined,
    maxSize: maxFileSize * 1024 * 1024,
    multiple: allowMultiple,
    onDropRejected: (rejectedFiles) => {
      const oversized = rejectedFiles
        .filter((file) => file.errors[0]?.code === 'file-too-large')
        .map((file) => file.file.name);
      setOversizedFiles(oversized);
    }
  });

  // Function to handle file upload
  const uploadFile = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await fetch('http://localhost/api/v4/user-data/file-uploder', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        setIsLoading(false);
        throw new Error('Upload failed. Please try again.');
      }
      const responseData = await response.json();
      setIsLoading(false);
      setFiles((prevFiles) => {
        return prevFiles?.map((f) => {
          if (f?.name === file.name) {
            return {
              ...f,
              progress: 100,
              status: 'success',
              response: responseData?.data[0]
            };
          } else {
            return f;
          }
        });
      });

      setResponses((prevResponses: any) => [...prevResponses, responseData.data[0]]); // Add the response to the responses state

      if (files.every((f) => f.status === 'success')) {
        setUploadComplete(true);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.name === file.name
            ? { ...f, status: 'error', message: 'Upload failed. Please try again.' }
            : f
        )
      );
    }
  };

  // Function to reset the uploader state
  const resetUploader = () => {
    setFiles([]);
    setUploadComplete(false);
    setResponses([]);
    setOversizedFiles([]);
    setMaxUploadExceeded(false);
  };

  // Updated the uploader state
  // useEffect(() => {
  //   setResponses(files);
  // }, [files]);

  // Extract the desired parts
  const formats = acceptedFileTypes?.map((type) => type.split('/')[1]);

  return (
    <div
      className={`flex w-full flex-col gap-4 ${bordered && color === 'default' ? 'border border-muted-200 dark:border-muted-700' : ''} ${bordered && color === 'contrast' ? 'border border-muted-200 dark:border-muted-800' : ''} ${bordered && color === 'muted' ? 'border border-muted-200 dark:border-muted-700' : ''} ${bordered && color === 'mutedContrast' ? 'border border-muted-200 dark:border-muted-800' : ''} ${shape === 'rounded' ? 'rounded-md' : ''} ${shape === 'smooth' ? 'rounded-lg' : ''} ${shape === 'curved' ? 'rounded-xl' : ''} ${shape === 'full' ? 'rounded-xl' : ''} ${color === 'default' ? 'bg-white dark:bg-muted-800' : ''} ${color === 'contrast' ? 'bg-white dark:bg-muted-950' : ''} ${color === 'muted' ? 'bg-muted-100 dark:bg-muted-800' : ''} ${color === 'mutedContrast' ? 'bg-muted-100 dark:bg-muted-950' : ''} `}
    >
      <div className="w-full">
        <label className={`block pb-3 pt-6 ${spaced ? 'px-6' : ''}`}>
          <span className="block text-sm text-muted-500 dark:text-muted-400">
            {`Max File Size: ${maxFileSize}MB` || label}
          </span>
          <span className="block text-sm text-muted-500 dark:text-muted-400">{`Max File Upload: ${maxUploads}`}</span>
          <span className="block text-xs text-muted-500 dark:text-muted-400">
            {`Accept File Types: ${formats?.join(', ')}` || labelAlt}
          </span>
        </label>

        <div className={`group ${spaced ? 'px-6' : ''}`}>
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed border-muted-300 bg-muted-50 p-5 dark:border-muted-700 dark:bg-muted-800 ${shape === 'rounded' ? 'rounded-md' : ''} ${shape === 'smooth' ? 'rounded-lg' : ''} ${shape === 'curved' ? 'rounded-xl' : ''} ${shape === 'full' ? 'rounded-xl' : ''} `}
          >
            <input {...getInputProps()} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              className="mx-auto mb-4 h-14 w-14 text-muted-400 transition-colors duration-300 group-hover:text-primary-500"
            >
              <g fill="none" stroke="currentColor" strokeLinejoin="round">
                <path d="M2 14.5A4.5 4.5 0 0 0 6.5 19h12a3.5 3.5 0 0 0 .5-6.965a7 7 0 0 0-13.76-1.857A4.502 4.502 0 0 0 2 14.5Z" />
                <path strokeLinecap="round" d="m14 11l-2-2m0 0l-2 2m2-2v6" />
              </g>
            </svg>
            <div className="mx-auto flex max-w-xs flex-col text-center">
              <p className="text-sm text-muted-500 dark:text-muted-400">
                {isDragActive
                  ? 'Drop the files here ...'
                  : "Drag 'n' drop some files here, or click to select files"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`mb-4 flex flex-col-reverse gap-2 overflow-x-auto ${spaced ? 'px-6' : ''}`}>
        {oversizedFiles.length > 0 && (
          <div className="mb-2 text-xs text-error-500">
            The following file(s) exceed the maximum size of {maxFileSize}MB:
            <ul className="list-inside list-disc">
              {oversizedFiles.map((file) => (
                <li key={file}>{file}</li>
              ))}
            </ul>
          </div>
        )}
        {maxUploadExceeded && (
          <div className="mb-2 text-xs text-error-500">
            The maximum number of file uploads ({maxUploads}) has been exceeded.
          </div>
        )}
        {files.map((file: any) => {
          return (
            <div key={file.name} className="flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-500 dark:text-muted-400">{file.name}</span>
                {/* loader  */}
                {isLoading && file.status !== 'success' && (
                  <Loader thickness={2} size={11} classNames="text-primary-500" />
                )}
              </div>
              <div
                className={`flex h-6 items-center gap-2 overflow-hidden rounded-md border border-muted-200 py-3 pl-2 dark:border-muted-700 ${file.status !== 'success' && 'pr-2'} ${file.status !== 'success' && 'pr-4'}`}
              >
                {file.status === 'success' && (
                  <div className="mr-2">
                    <ReIcon
                      iconName="AiFillCheckCircle"
                      className="-me-3 h-4 w-4 text-success-500"
                    />
                  </div>
                )}

                {/* progress bar  */}
                <Progress size="xs" color="primary" value={file.progress} />
                {file.status === 'success' && (
                  <div className="flex gap-2 pr-2">
                    <a href={file?.response?.url} target="_blank" rel="noreferrer">
                      <ReIcon iconName="CgEye" className="h-4 w-4 text-primary-500" />
                    </a>
                    {/* <button
                      onClick={() => {
                        setFiles((prevFiles: any) =>
                          prevFiles.filter((f: any) => f.name !== file.name)
                        );
                      }}
                    >
                      <ReIcon iconName="AiOutlineClose" className="h-4 w-4 text-error-500" />
                    </button> */}
                  </div>
                )}
                {file.status === 'error' && (
                  <ReIcon
                    iconName="AiOutlinePlusCircle"
                    className="-me-3 h-5 w-5 rotate-45 text-error-500"
                  />
                )}
              </div>
              {file.status === 'error' && (
                <p className="mb-2 text-xs font-normal text-error-500">{file.message}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* {uploadComplete && (
        <div className={`flex flex-col gap-2 py-3 ${spaced ? 'px-6' : ''}`}>
          <div className="mt-3 w-full text-center">
            <IconBox
              icon="AiOutlineCheckCircle"
              variant="pastel"
              color="success"
              className="mx-auto mb-2"
            />
            <h3 className="mb-1 text-base font-light text-muted-800 dark:text-muted-100">
              Upload Complete
            </h3>
            <p className="mx-auto max-w-[320px] text-sm text-muted-500 dark:text-muted-400">
              Great, your file{allowMultiple ? 's were' : ' was'} successfully uploaded.
            </p>
          </div>
        </div>
      )} */}

      {/* {(uploadComplete || files.length > 0 || oversizedFiles.length > 0 || maxUploadExceeded) && (
        <div className={`pb-6 ${spaced ? 'px-6' : ''}`}>
          <Button
            shape={shape}
            color="muted"
            type="button"
            className="w-full"
            onClick={resetUploader}
          >
            Upload Again
          </Button>
        </div>
      )} */}
    </div>
  );
}
