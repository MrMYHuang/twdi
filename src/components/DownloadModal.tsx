import React from 'react';
import { IonContent, IonLabel, IonModal, IonProgressBar } from '@ionic/react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

interface Props {
  showModal: boolean;
  progress: number;
}

interface PageProps extends Props, RouteComponentProps<{
}> { }

interface State {
}

class _DownloadModal extends React.Component<PageProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <IonModal
        isOpen={this.props.showModal}
        cssClass='uiFont'
        backdropDismiss={false}
        swipeToClose={false}
      >
        <IonContent>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
              <IonLabel className='uiFont'>App 初始化</IonLabel>
              <IonLabel className='uiFont'>離線藥品資料下載中，請等待。</IonLabel>
          </div>
        </IonContent>
      </IonModal>
    );
  }
};

const mapStateToProps = (state: any /*, ownProps*/) => {
  return {
  }
};

//const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
)(_DownloadModal);
