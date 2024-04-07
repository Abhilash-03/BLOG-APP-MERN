import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginStart, loginSuccess, loginFailure } from "../redux/user/userSlice"
import { useDispatch, useSelector } from "react-redux"
import OAuth from "../components/OAuth"

const Login = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: isLoading, error: errorMsg } = useSelector((state) => state.user);
  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id] : e.target.value.trim() });
  }
  const URL = 'https://akjblogserver.vercel.app';
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    const { email, password } = formData;
    if(!email || !password){
      return dispatch(loginFailure('Please fill all the fields'));
    }
    try {
      dispatch(loginStart());
      const res = await fetch(`${URL}/api/v1/auth/login`, {
        method: 'POST', 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json();
      console.log(data);
      if(data.success === false) {
        dispatch(loginFailure(data.message));
      }

      if(res.ok){
        dispatch(loginSuccess(data))
        navigate('/')
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  }

  return (
    <div className="min-h-screen mt-20">
       <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left side */}
         <div className="flex-1">
         <Link to='/' className="font-bold dark:text-white font-mono text-4xl" >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white font-serif">Abhilash's</span>Blog
      </Link>
       <p className="text-sm mt-5">
        This is a demo project. You can login with your email and password or with Google.
       </p>
         </div>
         {/* right side */}

         <div className="flex-1">
           <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
             <div>
               <Label value="Your email"/>
               <TextInput
                 type="email"
                 placeholder="your@email.com"
                 id="email"
                 onChange={handleChange}

               />
             </div>
             <div>
               <Label value="Your password"/>
               <TextInput
                 type="password"
                 placeholder="*********"
                 id="password"
                 onChange={handleChange}

               />
             </div>
             <Button gradientMonochrome="success" type="submit" >
              { isLoading ? (
                <>
                <Spinner size='sm' />
                <span className="pl-3">Loading...</span>
                </>
              ) : 'Login'}
              </Button>
              <OAuth />
           </form>
           <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to='/sign-up' className="text-blue-500"> Sign Up</Link>
           </div>
           {
      errorMsg && (
        <Alert className="mt-5 font-bold" color='failure'>
          {errorMsg}
        </Alert>
      )
    }
         </div>
       </div>
 
    </div>

  )
}

export default Login
