//
//  WebViewController.m
//  Viafoura_UIWebview
//
//  Created by Demetrios Kallergis on 2014-04-28.
//  Copyright (c) 2014 Viafoura. All rights reserved.
//

#import "WebViewController.h"


@interface WebViewController ()
@end

@implementation WebViewController


- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];

    if (self) 
    {
    }
        
    return self;
}


-(void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    NSString *serverPath = @"http://gusmelo.com/envs/envs.html";
    
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:serverPath]];
    
    [webView loadRequest:request];

    return;
}


- (void)viewDidLoad
{
    [super viewDidLoad];
}


- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

#pragma mark ViafouraSocialLogin delegate

-(void) socialLoginSuccessful
{
    //
    // This gets fired when a social login is succesful
    //
    return;
}

-(void) socialLoginCancelled
{
    //
    // This gets fired when a social login process is cancelled by the user.
    // 
    return;
}

#pragma mark UIWebView Delegate Functions

- (BOOL)webView:(UIWebView *)webViewInput shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType;
{

    NSString *url = request.URL.absoluteString;
    
    //
    // Bring up the Viafoura Social Login controller to handle the social login process
    //
    if ([url rangeOfString:VIAFOURA_SOCIAL_LOGIN_URL].location != NSNotFound)
    {
        NSLog(@"Caught social login click.  Sending request to Viafoura Social Login Controller.");
        
        socialLoginController = [[ViafouraSocialLoginViewController alloc] initWithURLRequest:request andParentWebView:webViewInput];
        
        socialLoginController.delegate = self;
        
        //
        // Display the social login view controller
        // 
        [self.view addSubview:socialLoginController.view];

        //
        // Stop processing this request - because it is being done by the social login controller.
        //
        return NO;
    }
    
    return YES;
}


@end
