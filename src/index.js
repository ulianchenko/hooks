import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  const [value, setValue] = useState(1);
  const [visible, setVisible] = useState(true);
  // const [visibleNotification, setvisibleNotification] = useState(true);

  if (visible) {
    return (
      <div>
        <button onClick={() => setValue((value) => value+1)}>+</button>
        <button onClick={() => setVisible(false)}>Hide</button>
        <ClassCounter value={value}/>
        <HookCounter value={value}/>
        <Notification />
        <PlanetInfo id={value}/>
      </div>
    )
  } else {
    return <button onClick={() => setVisible(true)}>Show</button>
  }
};

const HookCounter = ({value}) => {
  // return <p>{ value }</p>
  useEffect(() => {
    console.log('mount');
    return () => console.log('unmount');
  }, []);
  useEffect(() => {console.log('update')});
  //useEffect(() => () => console.log('unmount(componenWillUnmount)'), []); // or the same:
  // useEffect(() => {return () => console.log('clear(componenWillUnmount)')}, []);
  return <p> {value} </p>
};

const Notification = () => {

  const [visibleNotification, setvisibleNotification] = useState(true);

  useEffect(() => {
    // setTimeout(() => setvisibleNotification(false), 1500);
    const timeout = setTimeout(() => setvisibleNotification(false), 1500);
    return () => clearTimeout(timeout);
  }, []);

  if (visibleNotification) {
    return <div><p>Hello</p></div>
  } else {
    return null;
  }

  
    // return (
    //   <div>
    //     {visibleNotification && <p>Hello</p>}
    //   </div>
    // )
  
};

const getPlanet = (id) => {
  return fetch(`https://swapi.dev/api/planets/${id}`)
    .then(res => res.json())
    .then(data => data);
};

// const initialState = {
//   data: null,
//   loading: true,
//   error: null
// };

const useRequest = (request) => {
  const initialState = useMemo(() => ({
    data: null,
    loading: true,
    error: null
  }), []);
  const [dataState, setDataState] = useState(initialState);

  // const fetchPlanetName = (id) => fetch(`https://swapi.dev/api/planets/${id}`).then(res => res.json()).then(data => setPlanetName(data.name));

  // useEffect(() => {fetchPlanetName(id)}, [id])

  useEffect(() => {
    setDataState(initialState);
    let cancelled = false;
    request()
      .then(data => !cancelled && setDataState({
        data,
        loading: false,
        error: null
      }))
      . catch(error => !cancelled && setDataState({
        data: null,
        loading: false,
        error
      }));
    return () => cancelled = true;
  }, [ request, initialState ]);

  return dataState;
};

const usePlanetInfo = (id) => {
  const request = useCallback(() => getPlanet(id), [id]);
  return useRequest(request);
};

const PlanetInfo = ({id}) => {
  const { data, loading, error } = usePlanetInfo(id);

  if (error) {
    return <div>Something is wrong</div>;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div>{id} - {data.name}</div>
  );
};

class ClassCounter extends React.Component {
  componentDidMount() {
    console.log('class: mount');
  };
  componentDidUpdate(props) {
    console.log('class: update');
  };
  componentWillUnmount() {
    console.log('class: unmount');
  };


  render() {
    return <p>{this.props.value}</p>
  }
};

ReactDOM.render(<App />, document.getElementById('root'));