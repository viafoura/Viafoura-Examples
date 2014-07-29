//
//  WebViewController.h
//  Viafoura_UIWebview
//
//  Created by Demetrios Kallergis on 2014-04-28.
//  Copyright (c) 2014 Viafoura. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "ViafouraSocialLoginViewController.h"

@interface WebViewController : UIViewController <UIWebViewDelegate, ViafouraSocialLoginControllerDelegate>
{
    IBOutlet UIWebView *webView;
    
    ViafouraSocialLoginViewController *socialLoginController;    
}

@end
