import R from 'ramda';

const data = [
    {
        title: 'Purification of the PCR products',
        steps: [
            {
                title: 'Transfer PCR products',
                description: 'Place the plate on a vacuum manifold and turn on the vacuum (800 mbar) until the wells are\n    dry (do not over dry), release the vacuum',
                confirm: false,
                image: '',
            },
            {
                title: 'Clean the wells',
                description: 'Wash the wells by adding with 50uL of ddH2O, place on vacuum manifold as before until dry\n    ',
                confirm: false,
                image: '',
            },
            {
                title: 'Second cleaning\n',
                description: 'Wash the wells by adding with 50uL of ddH2O, place on vacuum manifold as before until dry\n',
                confirm: false,
                image: '',
            },
            {
                title: 'Seal the plate',
                description: 'Add 30uL of 5mM Tris pH=8.0 on the wells to resuspend the PCR products, seal the plate \n',
                confirm: false,
                image: '',
            },
            {
                title: 'Incubate',
                description: 'Incubate by shaking carefully on a vortex; set the speed to 4-6 for 5-10 min',
                confirm: false,
                image: '',
            },
            {
                title: 'Transfer resuspend PCR',
                description: 'Transfer the resuspended PCR products into a v-bottom PCR plates by pipetting up and\n    down while circulating carefully the “drop” on the top of the filter by resuspending all the dried\n    PCR products on the 30uL volume',
                confirm: false,
                image: '',
            },
        ],
    },
];

const state = {
    method: data,
};
const newState = R.clone(state);
const getGroup = groupId => R.path(['method', groupId]);
const getStep = (g, s) => R.compose(R.path(['steps', s]), getGroup(g));
const s = getStep(0, 1)(newState);
s.confirm = !s.confirm;

console.log(newState.method[0].steps[1]);
console.log(state.method[0].steps[1]);
