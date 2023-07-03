import React from 'react';

class XmlDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xmlContent: '',
    };
  }

  handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      this.setState({ xmlContent: event.target.result });
    };
    reader.readAsText(file);
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFileChange} />
        <p> "hi hi" </p>
      </div>
    );
  }
}

export default XmlDisplay;
