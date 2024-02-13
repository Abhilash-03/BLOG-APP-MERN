import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice'

const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [formData, setFormData] = useState({});
    const filePickerRef = useRef();
    const dispatch = useDispatch();

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if(file){
        setImageFile(file);
        setImageFileUrl(URL.createObjectURL(file));
      }
    }
    
    useEffect(() => {
         if(imageFile) {
          uploadImage();
         }
    }, [imageFile])

    const uploadImage = async () => {
      /*
       service firebase.storage {
       match /b/{bucket}/o {
       match /{allPaths=**} {
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 && 
      request.resource.contentType.matches('image/.*')
    }
  }
}
      */
     setImageFileUploading(true);
      setUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageFile.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
             setUploadError('Could not upload image (File must be less than 2MB)', error.message);
             setImageFileUploadProgress(null);
             setImageFileUrl(null);
            setImageFileUploading(false);

        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setFormData({...formData, profilePicture: downloadURL});
            setImageFileUploadProgress(null);
            setImageFileUploading(false);
          })
        }
      )
    }

    const handleChange = (e) => {
      setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit = async(e) => {
      e.preventDefault();
      setUpdateUserError(null);
      setUpdateUserSuccess(null);
      if(Object.keys(formData).length === 0){
        setUpdateUserError('No changes made')
        return;
      } 
      if(imageFileUploading){ 
        setUpdateUserError('Please wait for image to upload')
        return;
      }
      try {
        dispatch(updateStart());
        const res = await fetch(`/api/v1/user/update/${currentUser._id}`, {
          method: 'PATCH',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData)
        });
        const data = await res.json();  
        if(res.ok){
          dispatch(updateSuccess(data));
          setUpdateUserSuccess("User's profile updated successfully");
        } else{
          dispatch(updateFailure(data.message))
          setUpdateUserError(data.message)
        }
      } catch (error) {
        dispatch(updateFailure(error.message));
        setUpdateUserError(error.message)

      }
    }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextInput type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} className="hidden" />
         <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full relative" onClick={() => filePickerRef.current.click()}>
          {imageFileUploadProgress && (
            <CircularProgressbar value={imageFileUploadProgress} text={`${imageFileUploadProgress}%`}
             strokeWidth={5}
             styles={{
              root: {
                width: '100%',
                height:'100%',
                position: 'absolute',
                top: 0,
                left: 0
              },
              path: {
                stroke: `rbga(162,102,239, ${imageFileUploadProgress / 100})`
              }
             }}
            />
          ) }
            <img src={ imageFileUrl || currentUser.profilePicture } alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lighgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-10'}`}  />
         </div>
         {
          uploadError && (
            <Alert color='failure'>
               {uploadError}
            </Alert>
          )
         }
         <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username} onChange={handleChange} />
         <TextInput type="email" id="email" placeholder="email" defaultValue={currentUser.email} onChange={handleChange} />
         <TextInput type="password" id="password" placeholder="password" onChange={handleChange} />
         <Button type="submit" gradientMonochrome='info' outline>Update</Button>
      </form>
         <div className="text-red-500 flex justify-between mt-5">
            <span className="cursor-pointer hover:text-red-300 ">Delete Account</span>
            <span className="hover:text-red-300 cursor-pointer">Logout</span>
         </div>
         {updateUserSuccess && (
          <Alert color={'success'} className="mt-5 font-semibold">
            {updateUserSuccess}
          </Alert>
         )}
         {
           updateUserError && (
            <Alert color={'failure'} className="mt-5 font-semibold">
            {updateUserError}
          </Alert>
           )
         }
    </div>
  )
}

export default DashProfile
