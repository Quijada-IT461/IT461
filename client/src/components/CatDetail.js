import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const DogDetail = () => {
    const location = useLocation();
    const dog = location.state.dog;
    return (
        <div>
            <h1>Dog Detail</h1>
            <div>ID: {dog.id}</div>
            <div>Name: {dog.name}</div>
            <div>
                <Link to="/dogs">Back to Dogs List</Link>
            </div>
        </div>
    );
};

export default function CatDetail() {
    const location = useLocation();
    const { id } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [cat, setCat] = useState(() => location.state?.cat);

    useEffect(() => {
        if (!cat) getCat(axiosPrivate, id).then((res) => setCat(res.data));
    }, [axiosPrivate, cat, id]);

    return (
        <div>
            <h1>Cat Detail</h1>
            <div>ID: {cat?.id}</div>
            <div>Name: {cat?.name}</div>
            <div>
                <Link to="/cats">Back to Cats List</Link>
            </div>
        </div>
    );
}

const getCat = (axios, id) => axios.get(`/cats/${id}`);
