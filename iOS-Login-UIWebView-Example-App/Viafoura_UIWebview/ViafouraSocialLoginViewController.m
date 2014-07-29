//
//  ViafouraSocialLoginViewController.m
//  Viafoura_UIWebview
//
//  Created by Demetrios Kallergis on 2014-06-29.
//  Copyright (c) 2014 Viafoura. All rights reserved.
//

#import "ViafouraSocialLoginViewController.h"

#define VIAFOURA_SOCIAL_LOGIN_SUCCEEDED_URL @"viafoura-login.hub.loginradius.com/success.aspx"

@interface ViafouraSocialLoginViewController ()

@end

@implementation ViafouraSocialLoginViewController

@synthesize delegate = delegate;

-(id) initWithURLRequest:(NSURLRequest *) request andParentWebView:(UIWebView *) webView;
{
    self = [super initWithNibName:@"ViafouraSocialLoginViewController" bundle:nil];
    if (self) {
        initialRequest = request;
        parentWebView = webView;
    }
    
    successfulSocialLogin = NO;
    takeDownPopup = NO;
    
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    socialLoginWebView.scalesPageToFit = YES;
    
    [socialLoginWebView loadRequest:initialRequest];
}


-(IBAction) cancelSocialLogin: (id) sender
{
    if (delegate != nil &&
        [delegate respondsToSelector:@selector(socialLoginCancelled)])
    {
        [delegate socialLoginCancelled];
    }

    [self.view removeFromSuperview];
    [self removeFromParentViewController];
}


#pragma mark UIWebView Delegate Functions

- (BOOL)webView:(UIWebView *)webViewInput shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType;
{
    NSString *url = request.URL.absoluteString;
    NSLog(@"Popup Controller Url: %@", url);
    
    
    //
    // Look for the callback parameter when loading the social login URL.  Keep it for later.
    //
    if ([url rangeOfString:VIAFOURA_SOCIAL_LOGIN_URL].location != NSNotFound )
    {
        //
        // Read the call back url from the query string.
        //
        NSArray *params = [[[request URL] query] componentsSeparatedByString:@"&"];
        NSMutableDictionary *queryStringDictionary = [[NSMutableDictionary alloc] init];
        
        for (NSString *keyValuePair in params)
        {
            NSArray *pairComponents = [keyValuePair componentsSeparatedByString:@"="];
            NSString *key = [pairComponents objectAtIndex:0];
            NSString *value = [pairComponents objectAtIndex:1];
            
            [queryStringDictionary setObject:value forKey:key];
        }        
        
        self->callback = [queryStringDictionary objectForKey:@"callback"];
        
    }
    //
    // Otherwise, check if this requests indicates that the social login proess has succeeded.  If it has succeeded,
    // then pull out the token parameter, and use it to build a JavaScript command to later inject into the parent UIWebView.
    //
    else if ([url rangeOfString:VIAFOURA_SOCIAL_LOGIN_SUCCEEDED_URL].location != NSNotFound )
    {
        NSLog(@"Caught successful social login.");

        //
        // Watch for a successful login, and then flip the logged in flag to true
        //
        
        //
        // grab the token from the query string.
        //
        NSArray *params = [[[request URL] query] componentsSeparatedByString:@"&"];
        NSMutableDictionary *queryStringDictionary = [[NSMutableDictionary alloc] init];
        
        for (NSString *keyValuePair in params)
        {
            NSArray *pairComponents = [keyValuePair componentsSeparatedByString:@"="];
            NSString *key = [pairComponents objectAtIndex:0];
            NSString *value = [pairComponents objectAtIndex:1];
            
            [queryStringDictionary setObject:value forKey:key];
        }        
        
        self->postMessageCommand = [NSString stringWithFormat:@"window.postMessage('%@', '*');", 
                                   [queryStringDictionary objectForKey:@"token"]];
        
        
        NSLog(self->postMessageCommand);
        
        successfulSocialLogin = YES;
    }
    //
    // Otherwise, check if the request being placed is for the callback server we stored earlier, and make
    // sure that we're successfully logged in.  If both are true, then set the command to take down
    // the social login controller once the request completes.
    //
    else if ([url rangeOfString:callback].location != NSNotFound && 
              successfulSocialLogin == YES)
    {
        //
        // next, we want the popup taken down, if the callback loads successfully.
        //
        takeDownPopup = YES;
    }
    
    
    return YES;
}


- (void)webViewDidFinishLoad:(UIWebView *)webViewInput;
{
    //
    // If the callback request completes successfully, then inject the postMessage into the parent UIWebView,
    // then taken down the social login controller.
    //
    if (successfulSocialLogin == YES &&
        takeDownPopup == YES)
    {
        NSLog(@"About to inject postMessage to parent UIWebView");
        
        [parentWebView stringByEvaluatingJavaScriptFromString:self->postMessageCommand];        
        
        if (delegate != nil  &&
            [delegate respondsToSelector:@selector(socialLoginSuccessful)])
        {
            [delegate socialLoginSuccessful];
        }
        
        [self.view removeFromSuperview];
        [self removeFromParentViewController];
    }
}



@end
