import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import fu from "./index.module.css"

const KILO_BYTES_PER_BYTE = 1000;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 50000000;

const convertNestedObjectToArray = (nestedObj) =>
  Object.keys(nestedObj).map((key) => nestedObj[key]);

const convertBytesToKB = (bytes) => Math.round(bytes / KILO_BYTES_PER_BYTE);

const FileUpload = forwardRef (({
  label,
  updateFilesCb,
  handleChange,
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  ...otherProps
}, ref) => {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState({});

  const handleUploadBtnClick = () => {
    fileInputField.current.click();
  };

  const addNewFiles = (newFiles) => {
    for (let file of newFiles) {
      if (file.size <= maxFileSizeInBytes) {
        if (!otherProps.multiple) {
          return { file };
        }
        files[file.name] = file;
      }
    }
    return { ...files };
  };

  const callUpdateFilesCb = (files) => {
    const filesAsArray = convertNestedObjectToArray(files);
    updateFilesCb(filesAsArray);
  };

  const handleNewFileUpload = (e) => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      let updatedFiles = addNewFiles(newFiles);
      setFiles(updatedFiles);
      callUpdateFilesCb(updatedFiles);
    }
  };
  useImperativeHandle(ref, () => ({
    removeFiles() {
      setFiles({});
    }
  }))
  const removeFile = (fileName) => {
    delete files[fileName];
    setFiles({ ...files });
    callUpdateFilesCb({ ...files });
  };

  return (
    <>
      <div className={fu.container}>
        <label>{label}</label>
        <span>Drag and drop your files here or</span>
        <button className={fu.upbtn} onClick={handleUploadBtnClick}>Upload {otherProps.multiple ? "files" : "a file"}</button>
        <input
        className={fu.form}
          type="file"
          ref={fileInputField}
          onChange={handleNewFileUpload}
          title=""
          value=""
          {...otherProps}
        />
      </div>
      <div className={fu.dataCon}>
        <div className={fu.list}>
          {Object.keys(files).map((fileName, index) => {
            let file = files[fileName];
            let isImageFile = file.type.split("/")[0] === "image";
            return (
              <div  key={fileName}>
                <div className={fu.itemCon}>
                  {isImageFile && (
                    <img
                      className={fu.img}
                      src={URL.createObjectURL(file)}
                      alt={`file preview ${index}`}
                    />
                  )}
                  <div className={fu.item} isImageFile={isImageFile}>
                    <span>{file.name}</span>
                    <span>{convertBytesToKB(file.size)} kb</span>
                      {/* <RemoveFileIcon
                        className="fas fa-trash-alt"
                        onClick={() => removeFile(fileName)}
                      /> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  )
})

export default FileUpload;
