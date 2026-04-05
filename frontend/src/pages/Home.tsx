import React from "react";
import {motion} from "framer-motion";
import {Link} from "react-router-dom";
import ThreeBackground from "../components/ThreeBackground";
import Logo from "../components/logo";
export default function Home(){
    return (
       <div className="min-h-screen relative">
        <ThreeBackground />
        {/* 导航栏 - 移动端优化  */}
        <nav className="w-full z-40 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
            <div  className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <motion.div
                initial={{opacity:0,x:20}}
                animate={{opacity:1,x:0}}
                className="text-2xl font-display font-bold"
                >
                   <Logo size="md" animated={true} />
                </motion.div>

                <motion.div
                initial={{opacity:0,x:20}}
                animate={{opacity:1,z:0}}
                className="flex gap-6"
                >
                    <Link to="/login">
                        <button className="px-6 py-2 text-white hover:text-indigo-500 transition=-colors">
                            Login
                        </button>
                    </Link>
                    <Link to="/register">
                        <button className="px-6 py-2 text-white hover:text-indigo-500 transition=-colors">
                            Sign up
                        </button>
                    </Link>
                </motion.div>
            </div>
        </nav>

        {/* 主内容 */}
        <div className="flex items-center justify-center min-h-screen px-6 pt-20">
            <div className="max-w-5xl text-center">
                <motion.h1
                initial={{opacity:0,x:30}}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-7xl md:text-9xl font-display font-black mb-6 leading-tight"
                >
                    Showcase Your
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                    Creative Work
                    </span>
                </motion.h1>

                <motion.p
                initial={{opacity:0,y:30}}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
                >
                    Build your portfolio, connect with companies, and land your dream design job.
            All in one powerful platform.
                </motion.p>

                <motion.div
                    initial={{opacity:0,y:30}}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-6 justify-center"
                >
                    <Link to="/register">
                        <button className="px-8 py-4 bg-indigo-500 text-white text-lg font-semibold rounded-lg hover:bg-indigo-600 transition-all hover:scale-105">
                            Get Started Free
                        </button>
                    </Link>
                    <button className="px-8 py-4 border-indigo-500 text-indigo-500 text-lg font-semibold rounded-lg hover:bg-indigo-500/10 transition-all">
                        View Examples
                    </button>
                </motion.div>

                {/*统计数据*/}
                <motion.div
                    initial={{opacity:0}}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
                >
                    <div>
                        <div className="text-4xl font-bold text-indigo-500">10K+</div>
                        <div className="text-gray-400 mt-2">Designers</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-indigo-500">50K+</div>
                        <div className="text-gray-400 mt-2">Projects</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-indigo-500">500K+</div>
                        <div className="text-gray-400 mt-2">Companies</div>
                    </div>
                </motion.div>
            </div>
        </div>
       </div>
    );
}