/* eslint-disable */
import React,{useState, useEffect} from "react";
import './style/new.css';
import { Link, useNavigate} from "react-router-dom";
const Login = () => {
    const history = useNavigate();
    const [savedID, setSavedID] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const handleLogin = (e) => {
        e.preventDefault(); // 폼의 기본 제출 동작을 막습니다.
        const id = document.getElementById('id').value;
        const pwd = document.getElementById('pwd').value;
        if (isSaved) {
            localStorage.setItem('savedid', id); 
            localStorage.setItem('isSaved', 'true'); 
        } else {
            localStorage.removeItem('savedid'); 
            localStorage.setItem('isSaved', 'false'); 
        }
        if (id === 'admin' && pwd === 'admin') {
            history('/general');
        } else {
            alert('입력한 정보가 잘못되었습니다.');
        }
      }
        useEffect(() => {
            const saved = localStorage.getItem('savedid');
            const savedCheck = localStorage.getItem('isSaved') === 'true'; // 문자열 'true'를 불러와서 boolean으로 변환
            if (savedCheck && saved) {
                setIsSaved(savedCheck);
                setSavedID(saved);
            }
        }, []);
        /* const saveID = () => {
            const saved = localStorage.getItem('savedid');
            const savedCheck = localStorage.getItem('isSaved') === 'true';
            if (isSaved && saved) {
                setSavedID(saved);
            } else {
                setSavedID('');
            } 
        } */
   
    return(
        <>
            <div className="login_box"> 
                <div className="title">
                   <label className="login_title"> | </label><h2>Login</h2>
                </div>
                <form action="" onSubmit={handleLogin}>
                <div class="input_area_and_btn">
                    <div className="input_area">
                        <div><label className="id">MEMBER ID</label> <input type="text" id="id" name="id" value={savedID} onChange={(e) => setSavedID(e.target.value)} /></div>
                        <div><label className="pwd">PASSWORD</label> <input type="password" id="pwd" name="pwd"/></div>
                    </div>
                    <div className="login_btn">
                        <button type="submit">Login</button>
                    </div>
                </div>
                    <div className="chk_login">
                    <input type="checkbox" name="chksave" id="saveid" checked={isSaved} onChange={(e) => setIsSaved(e.target.checked)} />
                    <label>SAVE ID</label>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login;