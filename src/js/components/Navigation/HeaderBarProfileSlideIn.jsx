import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { Table } from "react-bootstrap";
import { cordovaDot, isWebApp, enclosingRectangle, isCordova } from "../../utils/cordovaUtils";
import HamburgerMenuRow from "./HamburgerMenuRow";
import { renderLog } from "../../utils/logging";

/* This class is deprecated March 15, 2018, Steve
   We may want to revive a sliding in menu, if so this could be the basis.
   Ok to delete this file/class in September 2018 (or earlier if you are certain)
 */

export default class HeaderBarProfileSlideIn extends Component {
  static propTypes = {
    profilePopUpOpen: PropTypes.bool,
    weVoteBrandingOff: PropTypes.bool,
    location: PropTypes.object,
    voter: PropTypes.object,
    pathname: PropTypes.string,
    toggleProfilePopUp: PropTypes.func.isRequired,
    hideProfilePopUp: PropTypes.func.isRequired,
    transitionToYourVoterGuide: PropTypes.func.isRequired,
    signOutAndHideProfilePopUp: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props);
    this.toggleProfilePopUp = this.props.toggleProfilePopUp.bind(this);
    this.hideProfilePopUp = this.props.hideProfilePopUp.bind(this);
    this.transitionToYourVoterGuide = this.props.transitionToYourVoterGuide.bind(this);
    this.signOutAndHideProfilePopUp = this.props.signOutAndHideProfilePopUp.bind(this);
  }

  componentDidMount () {
    enclosingRectangle("HeaderBarProfileSlideIn, ", this.instance);
  }

  yourAccountIcon (voterPhotoUrlMedium) {
    return (
      <span
        className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none"
        onClick={this.toggleProfilePopUp}
      >
        {voterPhotoUrlMedium ? (
          <div id="js-header-avatar" className="header-nav__avatar-container">
            <img
              className="header-nav__avatar"
              src={voterPhotoUrlMedium}
              height={34}
              width={34}
            />
          </div>
        ) : (
          <div id="anonIcon" className="header-nav__avatar">
            <img src={cordovaDot("/img/global/svg-icons/avatar-generic.svg")} width="34" height="34" color="#c0c0c0" alt="generic voter" />
          </div>
        )}
      </span>
    );
  }

  render () {
    const { voter } = this.props;
    renderLog(__filename);
    const isSignedIn = this.props.voter.is_signed_in;
    const voterPhotoUrlMedium = voter.voter_photo_url_medium;

    const linkedOrganizationWeVoteId = this.props.voter.linked_organization_we_vote_id;
    const signedInFacebook = this.props.voter.signed_in_facebook;
    const signedInTwitter = this.props.voter.signed_in_twitter;
    const twitterScreenName = this.props.voter.twitter_screen_name;
    const showYourPageFromTwitter = signedInTwitter && twitterScreenName;
    const showYourPageFromFacebook = signedInFacebook && linkedOrganizationWeVoteId && !showYourPageFromTwitter;
    let yourVoterGuideTo = null;
    if (showYourPageFromTwitter) {
      yourVoterGuideTo = `/${twitterScreenName}`;
    } else if (showYourPageFromTwitter) {
      yourVoterGuideTo = `/voterguide/${linkedOrganizationWeVoteId}`;
    } else if (!showYourPageFromTwitter && !showYourPageFromFacebook && isSignedIn) {
      yourVoterGuideTo = "/yourpage";
    }

    /* eslint-disable no-extra-parens */
    const profilePopUpOpen = () => {
      if (this.props.profilePopUpOpen) {
        return (isWebApp() ? "profile-menu--open" : "profile-foot-menu--open");
      }
      return "";
    };

    const signInColor = isSignedIn ? { fontSize: 28, color: "red" } : { fontSize: 28, color: "green" };

    return (
      <div className={profilePopUpOpen}>
        <div className="profile-foot-menu"
             ref={el => (this.instance = el)}  // eslint-disable-line no-return-assign
             onClick={this.hideProfilePopUp}
        >
          <Table striped bordered condensed hover responsive style={{ borderTop: 40, borderTopColor: "white" }}>
            <tr className="hamburger-tr">
              <td colSpan={3} style={{ padding: 15, color: "DarkGrey" }}>
                <span className="we-vote-promise" style={{ fontSize: 15 }}>Our Promise: We&apos;ll never sell your email.</span>
              </td>
            </tr>

            {yourVoterGuideTo && (
              <HamburgerMenuRow
                onClickAction={this.transitionToYourVoterGuide}
                to={yourVoterGuideTo}
                icon="fa fa-list"
                iconStyle={{ fontSize: 20, color: "#1c2f4b" }}
                linkText="Your Voter Guide"
              />
            )}

            {this.props.voter && isSignedIn && (
              <HamburgerMenuRow
                onClickAction={this.hideProfilePopUp}
                to="/settings/account"
                fullIcon={this.yourAccountIcon(voterPhotoUrlMedium)}
                linkText="Your Account"
              />
            )}

            {this.props.voter && (
              <HamburgerMenuRow
                onClickAction={this.signOutAndHideProfilePopUp}
                to="/settings/account"
                icon={isSignedIn ? "fa fa-sign-out" : "fa fa-sign-in"}
                iconStyle={signInColor}
                linkText={isSignedIn ? "Sign Out" : "Sign In"}
              />
            )}

            <HamburgerMenuRow
              onClickAction={this.signOutAndHideProfilePopUp}
              to="/more/howtouse"
              icon="fa fa-arrow-circle-right"
              iconStyle={{ fontSize: 28, color: "green" }}
              linkText="Getting Started"
            />

            <HamburgerMenuRow
              onClickAction={this.hideProfilePopUp}
              to="/more/about"
              icon="fa fa-users"
              iconStyle={{ fontSize: 20, color: "#1c2f4b" }}
              linkText="About We Vote"
            />

            {this.props.weVoteBrandingOff || isCordova() ? null : (
              <HamburgerMenuRow
                onClickAction={this.hideProfilePopUp}
                to="/more/donate"
                icon="fa fa-money"
                iconStyle={{ fontSize: 20, color: "green" }}
                linkText="Donate"
              />
            )}

            <tr style={{ height: 50 }}>
              <td colSpan={3} style={{ padding: 15, paddingBottom: 7, paddingTop: 23 }}>
                <span className="terms-and-privacy-slide" style={{ fontWeight: 400, fontSize: 14, color: "blue" }}>
                  <Link onClick={this.hideProfilePopUp} to="/more/terms">Terms of Service</Link>
                  <span style={{ paddingLeft: 20 }} />
                  <Link onClick={this.hideProfilePopUp} to="/more/privacy">Privacy Policy</Link>
                </span>
              </td>
            </tr>
          </Table>
        </div>
      </div>
    );
  }
}
