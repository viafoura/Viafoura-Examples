//
//  ViafouraSocialLoginViewController.h
//  Viafoura_UIWebview
//
//  Created by Demetrios Kallergis on 2014-06-29.
//  Copyright (c) 2014 Viafoura. All rights reserved.
//

#import <UIKit/UIKit.h>


@protocol ViafouraSocialLoginControllerDelegate <NSObject>

@optional
-(void) socialLoginSuccessful;
-(void) socialLoginCancelled;
@end

#define VIAFOURA_SOCIAL_LOGIN_URL @"viafoura-login.hub.loginradius.com/RequestHandlor.aspx"

@interface ViafouraSocialLoginViewController : UIViewController <UIWebViewDelegate>
{
    IBOutlet UIButton *closeButton;
    IBOutlet UIWebView *socialLoginWebView;
    
    UIWebView *parentWebView;
    
    NSURLRequest *initialRequest;
    NSString *postMessageCommand;
    
    NSString *callback;
    
    BOOL successfulSocialLogin;
    BOOL takeDownPopup;
    
    id<ViafouraSocialLoginControllerDelegate> delegate;
}

@property (nonatomic, retain) id <ViafouraSocialLoginControllerDelegate> delegate;

-(IBAction) cancelSocialLogin: (id) sender;
-(id) initWithURLRequest:(NSURLRequest *) request andParentWebView:(UIWebView *) webView;

@end
