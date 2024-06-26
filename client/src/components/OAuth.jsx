import { Button } from "flowbite-react"
import { AiFillGoogleCircle } from "react-icons/ai"
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { loginSuccess } from "../redux/user/userSlice"
import { useNavigate } from "react-router-dom"

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const auth = getAuth(app);
  const URL = 'https://akjblogserver.vercel.app';

    const handleGoogleClick = async() => {
      const provider = new GoogleAuthProvider()
      provider.getCustomParameters({ prompt: 'select_account' });
      try {
        const resultsFromGoogle = await signInWithPopup(auth, provider);
        const res = await fetch(`${URL}/api/v1/auth/google`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: resultsFromGoogle.user.displayName,
                email: resultsFromGoogle.user.email,
                googlePhotoUrl: resultsFromGoogle.user.photoURL
            })
        })
        const data = await res.json();
        if(res.ok){
            dispatch(loginSuccess(data));
            navigate('/');
        }
      } catch (error) {
        console.log(error);
      }
    }
  return (
    <Button type="button" gradientMonochrome="info" outline onClick={handleGoogleClick}>
       <AiFillGoogleCircle className="w-6 h-6 mr-2" />
       Continue with Google
    </Button>
  )
}

export default OAuth
