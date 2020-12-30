import React from "react";
import "./shop.styles.scss";
import CollectionsOverview from "../../collections-overview/collections-overview.component";
import CollectionPage from "../collection-page/collection-page.component";
import { Route } from "react-router-dom";
import { updateCollections } from "../../../redux/shop/shop.actions";
import { connect } from "react-redux";
import {
  firestore,
  convertSnapshotToMap,
} from "../../../firebase/firebase.utils";
import WithSpinner from "../../with-spinner/with-spinner.component";

const CollectionsOverviewWithSpinner = WithSpinner(CollectionsOverview);
const CollectionPageWithSpinner = WithSpinner(CollectionPage);

class ShopPage extends React.Component {
  state = {
    loading: true,
  };

  unsubscribeFromSnapshot = null;

  componentDidMount() {
    const { updateCollections } = this.props;
    const collectionRef = firestore.collection("collections");
    collectionRef.onSnapshot(async (snapShot) => {
      const collectionMap = convertSnapshotToMap(snapShot);
      updateCollections(collectionMap);
      this.state.loading = false;
    });
  }

  render() {
    const { match } = this.props;
    const { loading } = this.state;
    return (
      <div className="shoppage">
        <Route
          exact
          path={`${match.path}/`}
          render={(props) => (
            <CollectionsOverviewWithSpinner isLoading={loading} {...props} />
          )}
        ></Route>
        <Route
          exact
          path={`${match.path}/:collectionId`}
          render={(props) => (
            <CollectionPageWithSpinner isLoading={loading} {...props} />
          )}
        ></Route>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateCollections: (collectionsMap) =>
    dispatch(updateCollections(collectionsMap)),
});

export default connect(null, mapDispatchToProps)(ShopPage);
