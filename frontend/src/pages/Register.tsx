import React from 'react';
import { motion } from 'framer-motion';
import { Link,useNavigate } from 'react-router-dom';
import Logo from '../components/logo';
import { useAuth } from '../context/AuthContext';

export default function Register(){
    const navigate = useNavigate();
    const { register } = useAuth();
    
    interface FormData {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
        role: 'designer' | 'company';
    }
    
    const[formData,setFormData] = React.useState<FormData>({
        username:'',
        email:"",
        password:'',
        confirmPassword:'',
        role:'designer'//designer or company
    });
    const [error,setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword){
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError('');
        try{
            await register(formData.username, formData.email, formData.password, formData.role);
            navigate('/dashboard');
        }catch (err:any){
            setError(err.response?.data?.message || 'Registration failed');
        }finally {
            setLoading(false);
        }
    };
  return(
    <div className='min-h-screen flex items-center justify-center px-6 relative overflow-hidden'>
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"/>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"/>
        </div>
        <motion.div
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        className='w-full max-w-md relative z-10'
        >
            <div className='bg-dark-card border border-dark-border rounded-2xl p-8 backdrop-blur-xl'>
                {/*Logo*/}
                <Link to='/' className='block text-center mb-8'>
                   <div className="flex justify-center">
                <Logo size="md" animated={false} />  {/* ← 替换这里 */}
            </div>    
                </Link>
                <h3 className='text-2xl font-bold mb-2 text-center'>Create Account</h3>
                <p className='text-gray-400 text-center mb-8'>Join the creative community</p>
                {
                    error &&(
                        <div className='bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6'>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Role Selection */}
                        <div className='grid grid-cols-2 gap-4 mb-4'>
                            <button
                              type='button'
                              onClick={()=>setFormData({...formData,role:'designer'})}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                formData.role === 'designer' 
                                ? 'bg-indigo-500 bg-indigo-500/10'
                                : 'border-dark-border hover:border-indigo-500'
                              }`}
                            >
                                <div className='text-2xl mb-2'>🎨</div>
                                <div className='font-semibold'>designer</div>
                            </button>
                            <button
                            type='button'
                            onClick={()=>setFormData({...formData,role:'company'})}
                            className={`p-4 rounded-lg border-2 transition-all ${
                                formData.role === 'company' 
                                ? 'bg-purple-500 bg-purple-500/10'
                                : 'border-dark-border hover:border-purple-500'
                              }`}
                            >
                                <div className='text-2xl mb-2'>🏢</div>
                                <div className='font-semibold'>company</div>
                            </button>
                        </div>
                        {/*username*/}
                        <div>
                            <label className='block text-sm font-medium mb-2'>Username</label>
                            <input
                            type='text'
                            value={formData.username}
                            onChange={(e)=>setFormData({...formData,username:e.target.value})}
                            className='w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-indigo-500 transition-colors'
                            placeholder='Enter your username'
                            />
                        </div>
                        {/*email*/}
                        <div>
                            <label className='block text-sm font-medium mb-2'>Email</label>
                            <input
                            type='email'
                            value={formData.email}
                            onChange={(e)=>setFormData({...formData,email:e.target.value})}
                            className='w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-indigo-500 transition-colors'
                            placeholder='Enter your email'
                            />
                        </div>
                        {/*password*/}
                        <div>
                            <label className='block text-sm font-medium mb-2'>Password</label>
                            <input
                            type='password'
                            value={formData.password}
                            onChange={(e)=>setFormData({...formData,password:e.target.value})}
                            className='w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-indigo-500 transition-colors'
                            placeholder='Enter your password'
                            />
                        </div>
                        {/*confirmPassword*/}
                        <div>
                            <label className='block text-sm font-medium mb-2'>Confirm Password</label>
                            <input
                            type='password'
                            value={formData.confirmPassword}
                            onChange={(e)=>setFormData({...formData,confirmPassword:e.target.value})}
                            className='w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-indigo-500 transition-colors'
                            placeholder='Confirm your password'
                            />
                        </div>
                        <button
                        type='submit'
                        className='w-full py-3 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors'
                        >
                            Create Account
                        </button>
                    </form>
                    <p className="text-center mt-6 text-gray-400">
                        Already have an account?{' '}
                        <Link to="/Login" className='text-indigo-500 hover:text-indigo-400'>
                        Sign in
                        </Link>
                    </p>  
                </div>
        </motion.div>
    </div>
  )
}

