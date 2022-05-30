import { forwardRef, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const DogCard = ({ dog, getDogs, url }) => {
    const axiosPrivate = useAxiosPrivate();

    const deleteDog = (id) =>
        axiosPrivate.delete(`/dogs/${id}`).then(() => {
            // refetch on success
            getDogs(url);
        });

    const dialogRef = useRef();

    return (
        <tr key={dog.id}>
            <td>{dog.id}</td>
            <td>{dog.name}</td>
            <td>
                <Link to={`/dogs/view/${dog.id}`} state={{ dog }}>
                    {' '}
                    View{' '}
                </Link>{' '}
                |
                <Link to={`/dogs/edit/${dog.id}`} state={{ dog }}>
                    {' '}
                    Edit{' '}
                </Link>{' '}
                |
                <a
                    href=""
                    onClick={(e) => {
                        e.preventDefault();
                        dialogRef.current.showModal();
                    }}
                >
                    Delete
                </a>
                <DeleteDialogForm
                    ref={dialogRef}
                    onSubmit={() => {
                        deleteDog(dog.id);
                    }}
                />
            </td>
        </tr>
    );
};

const DeleteDialogForm = forwardRef((props, ref) => (
    <dialog ref={ref}>
        <form method="dialog" onSubmit={props.onSubmit}>
            <header>
                <h4>Are you sure?</h4>
                <p>You cannot undo this action.</p>
            </header>
            <footer>
                <menu>
                    <button
                        className="cancel"
                        type="button"
                        onClick={() => ref.current.close()}
                    >
                        Cancel
                    </button>
                    <button>Confirm</button>
                </menu>
            </footer>
        </form>
    </dialog>
));

export default DogCard;
