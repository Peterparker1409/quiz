import { Link } from 'react-router-dom';

const Quiz = () => {
    return (
        <>
            <div className="flex flex-col mx-auto w-1/5 mt-20 gap-10 bg-slate-200 p-10 shadow-md">
                <div className="flex flex-col">
                    <h1 className="text-2xl mb-4 font-bold">Start Quiz</h1>
                    <label>Số câu hỏi</label>
                    <select name="" id="">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>

                    <div className="flex flex-col mt-5">
                        <label>Chủ đề</label>
                        <select>
                            <option value="1">Toán</option>
                            <option value="2">Lịch Sử</option>
                        </select>
                    </div>
                    <div className="flex flex-col mt-5">
                        <label>Mức Độ</label>
                        <select>
                            <option value="1">Dễ</option>
                            <option value="2">Trung Bình</option>
                            <option value="3">Khó</option>
                        </select>
                    </div>
                    <Link to="/questions"> 
                        <button className="bg-yellow-500 w-1/3 mt-5">Start</button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Quiz;
