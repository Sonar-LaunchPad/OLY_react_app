import classes from './spinner.module.css';

const Spinner = () => (
    <svg className={classes.Spinner} viewBox="0 0 50 50">
        <circle className={classes.Path} cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
    </svg>
)

export default Spinner;