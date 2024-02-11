import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DashProfile = () => {
    const { currentUser } = useSelector(state => state.user);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const filePickerRef = useRef();
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
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setImageFileUploadProgress(null);

          })
        }
      )
    }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
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
         <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username} />
         <TextInput type="email" id="email" placeholder="email" defaultValue={currentUser.email} />
         <TextInput type="password" id="password" placeholder="password" />
         <Button type="submit" gradientMonochrome='info' outline>Update</Button>
         <div className="text-red-500 flex justify-between mt-5">
            <span className="cursor-pointer hover:text-red-300 ">Delete Account</span>
            <span className="hover:text-red-300 cursor-pointer">Logout</span>
         </div>
      </form>
    </div>
  )
}

export default DashProfile
