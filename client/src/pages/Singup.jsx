import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import OAuth from "../components/OAuth";

const Singup = () => {
  const [formData, setFormData] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.id] : e.target.value.trim() });
  }
  const URL = 'https://akjblogserver.vercel.app';


  const handleSubmit = async(e) => {
    e.preventDefault();
    const { username, email, password } = formData;
    if(!username || !email || !password){
      return setErrorMsg('Please fill out all fields.');
    }
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await fetch(`${URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json();
      if(data.success === false) {
        setErrorMsg(data.message);
        setIsLoading(false);
      }

      if(res.ok){
        navigate('/login')
      }
    } catch (error) {
      setErrorMsg(error.message)
      setIsLoading(false);

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
        This is a demo project. You can sign-up with your email and password or with Google.
       </p>
         </div>
         {/* right side */}

         <div className="flex-1">
           <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
             <div>
               <Label value="Your username"/>
               <TextInput
                 type="text"
                 placeholder="Username"
                 id="username"
                 onChange={handleChange}
               />
             </div>
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
                 placeholder="Password"
                 id="password"
                 onChange={handleChange}

               />
             </div>
             <Button gradientMonochrome="success" type="submit" disabled={isLoading}>
              { isLoading ? (
                <>
                <Spinner size='sm' />
                <span className="pl-3">Loading...</span>
                </>
              ) : 'Sign Up'}
              </Button>
              <OAuth />

           </form>
           <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to='/login' className="text-blue-500"> Login</Link>
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

export default Singup
