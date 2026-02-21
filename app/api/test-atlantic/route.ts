import { NextRequest, NextResponse } from 'next/server'

// Test Atlantic API connectivity and configuration
export async function GET(request: NextRequest) {
  const apiKey = process.env.ATLANTIC_API_KEY
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    apiKeyLastChars: apiKey ? '***' + apiKey.slice(-4) : 'NOT_SET',
    baseUrl: 'https://atlantich2h.com',
  }

  console.log('[Yilzi] Atlantic API Diagnostics:', diagnostics)

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error: 'ATLANTIC_API_KEY is not configured',
        diagnostics,
        solution: 'Please set ATLANTIC_API_KEY environment variable in your deployment settings',
      },
      { status: 400 }
    )
  }

  try {
    // Test the /deposit/metode endpoint
    const formData = new URLSearchParams({
      api_key: apiKey,
    })

    console.log('[Yilzi] Testing Atlantic API connection...')

    const response = await fetch('https://atlantich2h.com/deposit/metode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      body: formData.toString(),
    })

    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    let responseData: any = null
    let responseText = ''

    if (isJson) {
      responseData = await response.json()
    } else {
      responseText = await response.text()
    }

    const testResult = {
      success: response.ok && isJson && responseData?.status,
      statusCode: response.status,
      statusText: response.statusText,
      contentType,
      isJson,
      apiResponse: isJson ? responseData : responseText.substring(0, 300),
    }

    console.log('[Yilzi] Atlantic API test result:', testResult)

    if (!response.ok || !isJson) {
      return NextResponse.json(
        {
          success: false,
          error: `Atlantic API test failed with status ${response.status}`,
          diagnostics,
          testResult,
          solutions: [
            'Verify your ATLANTIC_API_KEY is correct and not expired',
            'Check if https://atlantich2h.com is accessible',
            'If getting 403 Forbidden, your API key might be invalid or your IP might be blocked',
            'Try accessing the Atlantic H2H dashboard to verify your account is active',
            'Contact Atlantic support if the issue persists',
          ],
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Atlantic API is working correctly',
      diagnostics,
      testResult,
      availableMethods: responseData.data?.length || 0,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Yilzi] Atlantic API test error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Atlantic API test failed with exception',
        diagnostics,
        exception: errorMessage,
        solutions: [
          'Check if your network allows outbound connections to https://atlantich2h.com',
          'Verify NEXT_PUBLIC_DOMAIN or NEXT_PUBLIC_URL is set correctly',
          'Check server logs for more details',
        ],
      },
      { status: 500 }
    )
  }
}
