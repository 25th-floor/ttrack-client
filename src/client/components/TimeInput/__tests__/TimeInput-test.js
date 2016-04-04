
jest.dontMock('../index.js');

describe('TimeInput', function() {
    var React = require('react');
    var TestUtils = require('react-addons-test-utils');
    var TimeInput;
    var dummyOnChange = function() {};

    beforeEach(function() {
        TimeInput = require('../index.js');
    });

    it('should exists', function() {
        // Render a checkbox with label in the document
        var input = TestUtils.renderIntoDocument(
            <TimeInput name="myTime" onChange={dummyOnChange}/>
        );
        expect(TestUtils.isCompositeComponent(input)).toBeTruthy();
    });

    //it('if required it will show has-error', function() {
    //    var onChange = function() {};
    //
    //    // Render a checkbox with label in the document
    //    var input = TestUtils.renderIntoDocument(
    //        <TimeInput name="myTime" onChange={onChange} required={true} />
    //    );
    //
    //    var div = TestUtils.findRenderedDOMComponentWithClass(input, 'has-error');
    //
    //    expect(React.findDOMNode(div)).not.toBeNull();
    //});
});
